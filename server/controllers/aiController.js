const { analyzeShoppingRequest } = require("../services/aiService");
const Product = require("../models/Product");

const normalize = (value) => {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

// =====================================================
// FEATURE MATCHING
// =====================================================

const featureMatches = (requestedFeature, productText) => {
  const requested = normalize(requestedFeature);
  const text = normalize(productText);

  if (!requested) return false;

  // Direct match
  if (text.includes(requested)) {
    return true;
  }

  // -----------------------------------------------
  // SELF-HELP / PERSONAL DEVELOPMENT
  // -----------------------------------------------

  if (
    requested === "selfhelp" ||
    requested === "personaldevelopment" ||
    requested === "selfimprovement"
  ) {
    return (
      text.includes("selfhelp") ||
      text.includes("selfimprovement") ||
      text.includes("personaldevelopment") ||
      text.includes("personalgrowth") ||
      text.includes("habitbuilding") ||
      text.includes("purpose")
    );
  }

  // -----------------------------------------------
  // CAMERA / PHOTOGRAPHY
  // -----------------------------------------------

  if (requested.includes("camera") || requested.includes("photography")) {
    return (
      text.includes("camera") ||
      text.includes("photography") ||
      text.includes("mp")
    );
  }

  // -----------------------------------------------
  // MICROPHONE
  // -----------------------------------------------

  if (requested.includes("microphone") || requested.includes("mic")) {
    return text.includes("microphone") || text.includes("mic");
  }

  // -----------------------------------------------
  // WIRELESS
  // -----------------------------------------------

  if (requested.includes("wireless")) {
    return text.includes("wireless");
  }

  // -----------------------------------------------
  // NOISE CANCELLATION
  // -----------------------------------------------

  if (
    requested.includes("noisecancellation") ||
    requested.includes("noisecancelling")
  ) {
    return (
      text.includes("noisecancellation") ||
      text.includes("noisecancelling") ||
      text.includes("anc")
    );
  }

  // -----------------------------------------------
  // BATTERY
  // -----------------------------------------------

  if (requested.includes("battery")) {
    return text.includes("battery");
  }

  // -----------------------------------------------
  // PERFORMANCE / FAST
  // -----------------------------------------------

  if (requested.includes("performance") || requested.includes("fast")) {
    return (
      text.includes("performance") ||
      text.includes("fast") ||
      text.includes("processor")
    );
  }

  return false;
};
// =====================================================
// MAIN CONTROLLER
// =====================================================

const recommendProducts = async (req, res) => {
  try {
    const {
      message,
      conversationHistory = [],
      previousRequirements = null,
    } = req.body;

    // =================================================
    // 1. VALIDATE
    // =================================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Shopping request is required",
      });
    }

    // =================================================
    // 2. ASK GEMINI
    // =================================================

    const result = await analyzeShoppingRequest(
      message,
      conversationHistory,
      previousRequirements,
    );

    let requirements;

    try {
      requirements = typeof result === "string" ? JSON.parse(result) : result;
    } catch (error) {
      console.error("Invalid AI JSON:", result);

      return res.status(500).json({
        message: "AI returned an invalid response",
      });
    }

    // =====================================================
    // MERGE PREVIOUS + CURRENT REQUIREMENTS
    // =====================================================

    const previous = previousRequirements || {};

    requirements = {
      department: requirements.department || previous.department || null,

      productType: requirements.productType || previous.productType || null,

      minBudget:
        requirements.minBudget !== null && requirements.minBudget !== undefined
          ? requirements.minBudget
          : (previous.minBudget ?? null),

      maxBudget:
        requirements.maxBudget !== null && requirements.maxBudget !== undefined
          ? requirements.maxBudget
          : (previous.maxBudget ?? null),

      features: Array.from(
        new Set([
          ...(Array.isArray(previous.features) ? previous.features : []),

          ...(Array.isArray(requirements.features)
            ? requirements.features
            : []),
        ]),
      ),

      useCase: requirements.useCase || previous.useCase || null,

      brand: requirements.brand || previous.brand || null,

      intent: requirements.intent || previous.intent || "recommend",

      missingInformation: [],

      nextQuestion: null,
    };

    // =====================================================
    // CHECK REQUIRED INFORMATION
    // =====================================================

    if (!requirements.productType) {
      requirements.missingInformation.push("productType");
    }

    if (requirements.minBudget === null && requirements.maxBudget === null) {
      requirements.missingInformation.push("budget");
    }

    // =====================================================
    // ASK FOLLOW-UP QUESTION
    // =====================================================

    if (requirements.missingInformation.length > 0) {
      let nextQuestion;

      if (requirements.missingInformation.includes("productType")) {
        nextQuestion = "What specific product are you looking for?";
      } else if (requirements.missingInformation.includes("budget")) {
        nextQuestion = "What's your budget for this?";
      }

      requirements.nextQuestion = nextQuestion;

      return res.json({
        requirements,
        recommendations: [],
        message: nextQuestion,
      });
    }

    // =================================================
    // 3. LOAD ALL PRODUCTS
    // =================================================

    const products = await Product.find({});

    // =================================================
    // 4. DEPARTMENT / PRODUCT TYPE FILTER
    // =================================================

    let filteredProducts = products;

    // -----------------------------------------------
    // DEPARTMENT FILTER
    // -----------------------------------------------

    if (requirements.department) {
      const requestedDepartment = normalize(requirements.department);

      filteredProducts = filteredProducts.filter((product) => {
        const productDepartment = normalize(product.category);

        const matches =
          productDepartment &&
          (productDepartment.includes(requestedDepartment) ||
            requestedDepartment.includes(productDepartment));

        return matches;
      });
    }

    // -----------------------------------------------
    // 4. SPECIFIC PRODUCT TYPE FILTER
    // -----------------------------------------------

    if (requirements.productType) {
      const requestedProductType = normalize(requirements.productType);

      filteredProducts = filteredProducts.filter((product) => {
        const productName = normalize(product.name);
        const productCategory = normalize(product.category);
        const productType = normalize(product.type);

        const productFeatures = Array.isArray(product.features)
          ? product.features.map(normalize)
          : [];

        // Product types that are represented by their category
        if (requestedProductType === "phone" && productCategory === "mobiles") {
          return true;
        }

        if (requestedProductType === "book" && productCategory === "books") {
          return true;
        }

        const searchableText = [
          productName,
          productType,
          ...productFeatures,
        ].join(" ");

        return searchableText.includes(requestedProductType);
      });
    }

    // =================================================
    // 5. MINIMUM BUDGET
    // =================================================

    if (
      requirements.minBudget !== null &&
      requirements.minBudget !== undefined &&
      !isNaN(Number(requirements.minBudget))
    ) {
      const minBudget = Number(requirements.minBudget);

      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minBudget,
      );
    }

    // =================================================
    // 6. MAXIMUM BUDGET
    // =================================================

    if (
      requirements.maxBudget !== null &&
      requirements.maxBudget !== undefined &&
      !isNaN(Number(requirements.maxBudget))
    ) {
      const maxBudget = Number(requirements.maxBudget);

      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxBudget,
      );
    }

    // =================================================
    // 7. NO PRODUCTS FOUND
    // =================================================

    if (filteredProducts.length === 0) {
      return res.json({
        requirements,
        recommendations: [],
        message:
          "I couldn't find a matching product. Try changing your budget or product preferences.",
      });
    }

    // =================================================
    // 8. SCORE PRODUCTS
    // =================================================

    const scoredProducts = filteredProducts.map((product) => {
      let score = 0;

      const productName = normalize(product.name);
      const productCategory = normalize(product.category);
      const productType = normalize(product.type);

      const productFeatures = Array.isArray(product.features)
        ? product.features.map(normalize)
        : [];

      const searchableProductText = [
        productName,
        productCategory,
        productType,
        ...productFeatures,
      ].join(" ");

      const productUseCases = Array.isArray(product.useCase)
        ? product.useCase.map(normalize)
        : [];

      const productBrand = normalize(product.brand);

      // =================================================
      // DEPARTMENT / PRODUCT TYPE MATCH
      // =================================================

      if (requirements.department) {
        const requestedDepartment = normalize(requirements.department);

        const departmentMatch =
          productCategory &&
          (productCategory.includes(requestedDepartment) ||
            requestedDepartment.includes(productCategory));

        if (departmentMatch) {
          score += 30;
        }
      }

      if (requirements.productType) {
        const requestedProductType = normalize(requirements.productType);

        if (searchableProductText.includes(requestedProductType)) {
          score += 40;
        }
      }

      // =================================================
      // FEATURE MATCH
      // =================================================

      if (
        Array.isArray(requirements.features) &&
        requirements.features.length > 0
      ) {
        requirements.features.forEach((feature) => {
          if (featureMatches(feature, searchableProductText)) {
            score += 20;
          }
        });
      }

      // =================================================
      // USE CASE MATCH
      // =================================================

      if (requirements.useCase) {
        const requestedUseCase = normalize(requirements.useCase);

        if (requestedUseCase) {
          const matches = productUseCases.some(
            (useCase) =>
              useCase.includes(requestedUseCase) ||
              requestedUseCase.includes(useCase),
          );

          const textMatch = searchableProductText.includes(requestedUseCase);

          if (matches || textMatch) {
            score += 20;
          }
        }
      }

      // =================================================
      // BRAND MATCH
      // =================================================

      if (requirements.brand) {
        const requestedBrand = normalize(requirements.brand);

        if (requestedBrand && productBrand.includes(requestedBrand)) {
          score += 15;
        }
      }

      // =================================================
      // RATING
      // =================================================

      score += Number(product.rating || 0) * 2;

      // =================================================
      // BUDGET
      // =================================================

      if (
        requirements.maxBudget !== null &&
        requirements.maxBudget !== undefined
      ) {
        if (product.price <= Number(requirements.maxBudget)) {
          score += 10;
        }
      }

      if (
        requirements.minBudget !== null &&
        requirements.minBudget !== undefined
      ) {
        if (product.price >= Number(requirements.minBudget)) {
          score += 10;
        }
      }

      return {
        product,
        matchScore: Math.min(Math.round(score), 100),
      };
    });

    // =================================================
    // 10. SORT
    // =================================================

    scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

    // =================================================
    // 11. RETURN MAXIMUM 3
    // =================================================

    const recommendations = scoredProducts
      .filter((item) => item.matchScore >= 40)
      .slice(0, 3);

    // =================================================
    // 12. RESPONSE
    // =================================================

    return res.json({
      requirements,
      recommendations,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);

    return res.status(500).json({
      message: "AI recommendation failed",
    });
  }
};

module.exports = {
  recommendProducts,
};
