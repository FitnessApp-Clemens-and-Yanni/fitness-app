import { createTRPCRouter, publicProcedure } from "@/trpc";
import z from "zod";
import crypto from "crypto";
import OAuth from "oauth-1.0a";

export const FatSecretRouter = createTRPCRouter({
    getSearchFood: publicProcedure
        .input(
            z.object({
                search: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            try {
                const consumerKey = "45e8b8941912408b9a35f0a58c3c095e";
                const consumerSecret = "0492773edd994fefb43a318d688d5d4b";

                // Set up OAuth
                const oauth = new OAuth({
                    consumer: {
                        key: consumerKey,
                        secret: consumerSecret,
                    },
                    signature_method: 'HMAC-SHA1',
                    hash_function(baseString, key) {
                        return crypto
                            .createHmac('sha1', key)
                            .update(baseString)
                            .digest('base64');
                    },
                });

                // Request data
                const requestData = {
                    url: 'https://platform.fatsecret.com/rest/foods/search/v1',
                    method: 'GET',
                    data: {
                        method: 'foods.search',
                        search_expression: input.search,
                        format: 'json',
                    },
                };

                const headers = oauth.toHeader(oauth.authorize(requestData));

                const queryParams = new URLSearchParams({
                    method: 'foods.search',
                    search_expression: input.search,
                    format: 'json',
                }).toString();

                const response = await fetch(
                    `${requestData.url}?${queryParams}`,
                    {
                        method: 'GET',
                        headers: {
                            ...headers,
                        }
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API request failed: ${response.status}, ${errorText}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error searching food items:', error);
                throw new Error(`Failed to fetch food data: ${error instanceof Error ? error.message : String(error)}`);
            }
        }),
});