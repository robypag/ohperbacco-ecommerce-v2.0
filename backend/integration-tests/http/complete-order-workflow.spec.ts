import { medusaIntegrationTestRunner } from "@medusajs/test-utils";
import { markOrderAsCompleteWorkflow } from "../../src/workflows/complete-order";
import { describe, it, expect, jest } from "@jest/globals";

medusaIntegrationTestRunner({
    testSuite: ({ getContainer }) => {
        describe("Complete Order Workflow", () => {
            it("Should set the status of an order to completed", async () => {
                const { result } = await markOrderAsCompleteWorkflow(getContainer()).run({
                    input: {
                        fulfillment_id: "ful_01JMZW144V858TZ2HHFCCP8SKH",
                    },
                });
                expect(result.length).toBeGreaterThan(0);
                expect(result[0].status).toBe("completed");
            });
        });
    },
});

jest.setTimeout(60 * 1000);
