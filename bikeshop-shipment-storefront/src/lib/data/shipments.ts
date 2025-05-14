import { medusaClient } from "@lib/config"

/**
 * Fetches all shipments for the current user
 * @returns An array of shipments
 */
export async function getShipments() {
  const { data } = await medusaClient.client.request("GET", "/store/shipments")
  return data.shipments
}

/**
 * Fetches a shipment by id
 * @param id - The id of the shipment to fetch
 * @returns The shipment
 */
export async function getShipment(id: string) {
  const { data } = await medusaClient.client.request("GET", `/store/shipments/${id}`)
  return data.shipment
}

/**
 * Creates a new shipment
 * @param shipment - The shipment to create
 * @returns The created shipment
 */
export async function createShipment(shipment: any) {
  const { data } = await medusaClient.client.request("POST", "/store/shipments", shipment)
  return data.shipment
}

/**
 * Updates a shipment
 * @param id - The id of the shipment to update
 * @param shipment - The shipment data to update
 * @returns The updated shipment
 */
export async function updateShipment(id: string, shipment: any) {
  const { data } = await medusaClient.client.request("PUT", `/store/shipments/${id}`, shipment)
  return data.shipment
}

/**
 * Deletes a shipment
 * @param id - The id of the shipment to delete
 * @returns The deleted shipment
 */
export async function deleteShipment(id: string) {
  const { data } = await medusaClient.client.request("DELETE", `/store/shipments/${id}`)
  return data
}