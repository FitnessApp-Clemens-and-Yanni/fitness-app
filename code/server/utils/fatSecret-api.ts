import crypto from "crypto";
import OAuth from "oauth-1.0a";

export async function callFatSecretApi(
  endpoint: string,
  params: Record<string, string | number>,
) {
  const oauthConsumerKey = process.env.FATSECRET_CONSUMER_KEY!;
  const consumerSecret = process.env.FATSECRET_CONSUMER_SECRET!;

  const oauthNonceLength = 16;
  const oauthSignatureMethod = "HMAC-SHA1";

  const oauth = new OAuth({
    consumer: {
      key: oauthConsumerKey,
      secret: consumerSecret,
    },
    signature_method: oauthSignatureMethod,
    hash_function(baseString, key) {
      return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
  });

  const oauth_nonce = crypto.randomBytes(oauthNonceLength).toString("hex");
  const oauth_timestamp = Math.floor(Date.now() / 1000);

  const urlParams = {
    oauth_consumer_key: oauthConsumerKey,
    oauth_signature_method: oauthSignatureMethod,
    oauth_timestamp,
    oauth_nonce,
    oauth_version: "1.0",
    format: "json",
    ...params,
  };

  const url = new URL(endpoint);

  for (const [key, value] of Object.entries(urlParams)) {
    url.searchParams.set(key, value.toString());
  }

  const requestData = {
    method: "GET",
    url: url.href,
  };

  const authed = oauth.authorize(requestData);
  url.searchParams.set("oauth_signature", authed.oauth_signature);

  const res = await fetch(url.href, {
    method: requestData.method,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed: ${res.status}, ${errorText}`);
  }

  const data = await res.json();

  if (typeof data === "object" && data && "error" in data) {
    throw new Error(`API error: ${data.error.code}, ${data.error.message}`);
  }

  return data;
}

export const getMealTypeField = (mealType: string): string => {
  const mealTypeMapping: Record<string, string> = {
    Breakfast: "breakfastMeals",
    Lunch: "lunchMeals",
    Dinner: "dinnerMeals",
    Snack: "snackMeals",
  };

  return mealTypeMapping[mealType] || mealType;
};
