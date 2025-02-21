const Endpoint = {
  LOGIN: "/dev/api/v1/auth/login/post/",
  SIGN_UP: "/dev/api/v1/auth/sign_up/post/",
  SIGN_OUT: "/dev/api/v1/auth/signout/post/",
  CHANGE_PASSWORD: "/dev/api/v1/auth/change_password/post/",
  FORGOT_PASSWORD: "/dev/api/v1/auth/forgot_password/post/",
  CONFIRM_FORGOT_PASSWORD: "/dev/api/v1/auth/confirm_forgot_password/post/",
  VERIFY_OTP: "/dev/api/v1/auth/verify_otp/post/",
  RESEND_OTP: "/dev/api/v1/auth/resend_otp/post/",
  VERIFY_MFA: "/dev/api/v1/auth/mfa_verify/post/",
  IS_MFA: "/dev/api/v1/auth/is_mfa/post/",
  GET_SOFTWARE_TOKEN: "/dev/api/v1/auth/associate_software_token/post/post/",
  VERIFY_SOFTWARE_TOKEN: "/dev/api/v1/auth/verify_access_token/post/",
  SET_MFA_PREFERENCE: "/dev/api/v1/auth/verify_software_token/post/",
  UAM: {
    KEYWORD_OVERVIEW: "/api/v1/ecom/unified_ad_manager/keyword_overview/post/",
    KEYWORD_UPDATE: "/api/v1/ecom/unified_ad_manager/keyword_update/post/",
    AD_GROUP_OVERVIEW:
      "/api/v1/ecom/unified_ad_manager/ad_group_overview/post/",
    ADD_KEYWORD: "/api/v1/ecom/unified_ad_manager/add_keyword/post/",
    CAMPAIGN_OVERVIEW_POST:
      "/api/v1/ecom/unified_ad_manager/campaign_update/post/",
    CAMPAIGN_OVERVIEW:
      "/api/v1/ecom/unified_ad_manager/campaign_overview/post/",
    PRODUCT_OVERVIEW: "/api/v1/ecom/unified_ad_manager/product_overview/post/",
    PRODUCT_OVERVIEW_UPDATE:
      "/api/v1/ecom/unified_ad_manager/product_update/post/",
    AD_GROUP_UPDATE: "/api/v1/ecom/unified_ad_manager/ad_group_update/post/",
    CREATE_CAMPAIGN: "/api/v1/ecom/unified_ad_manager/campaign_create/post/",
    PLATFORM_FILTER: "/api/v1/ecom/unified_ad_manager/filters/platform/post/",
    STATUS_FILTER: "/api/v1/ecom/unified_ad_manager/filters/status/post/",
    CAMPAIGN_TYPE_FILTER:
      "/api/v1/ecom/unified_ad_manager/filters/campaign_type/post/",
    CAMPAIGN_NAME_FILTER:
      "/api/v1/ecom/unified_ad_manager/filters/campaign_name/post/",
    AD_GROUP_NAME_FILTER:
      "/api/v1/ecom/unified_ad_manager/filters/ad_group_name/post/",
    KEYWORD_FILTER: "/api/v1/ecom/unified_ad_manager/filters/keyword/post/",
    MATCH_TYPE_FILTER: "/api/v1/ecom/unified_ad_manager/filters/keyword/post/",
    PRODUCT_CODE_FILTER:
      "/api/v1/ecom/unified_ad_manager/filters/product_code/post/",
    AD_KEYWORD: "/api/v1/ecom/unified_ad_manager/add_keyword/post/",
    AD_PRODUCT: "/api/v1/ecom/unified_ad_manager/add_product/post/",
    // LOGS
    CAMPAIGN_LOGS: "/api/v1/ecom/unified_ad_manager/campaign_logs/post/",
    AD_GROUP_LOGS: "/api/v1/ecom/unified_ad_manager/ad_group_logs/post/",
    KEYWORD_LOGS: "/api/v1/ecom/unified_ad_manager/keyword_logs/post/",
    PRODUCT_LOGS: "/api/v1/ecom/unified_ad_manager/product_logs/post/",
    RULE_LOGS: "/api/v1/ecom/unified_ad_manager/rule_engine_logs/post/",
    RULE_RESPONSE: "/api/v1/ecom/unified_ad_manager/rule_engine_api_response/get/ge",
  },
  RULES: {
    GET_RULES_RULESET: "/getRules_RuleSet",
    FILTERS_RULES_RULESET: "/filterRules_RuleSet",
  },
};

export const RULE_ENGINE_URL =
  process.env.NEXT_PUBLIC_RULE_ENGINE_URL || "https://ruleengine.mfilterit.net";

export default Endpoint;
