import { Request, Response } from "express"
import ShipmentService from "../../../../modules/shipment/services/shipment.service"

/**
 * @schema CreateShipmentRequest
 * type: object
 * required:
 *   - tracking_number
 *   - carrier
 *   - shipping_address
 *   - recipient_name
 *   - recipient_email
 * properties:
 *   tracking_number:
 *     type: string
 *     description: The tracking number of the shipment
 *   carrier:
 *     type: string
 *     description: The carrier of the shipment
 *   shipping_address:
 *     type: string
 *     description: The shipping address
 *   recipient_name:
 *     type: string
 *     description: The name of the recipient
 *   recipient_email:
 *     type: string
 *     description: The email of the recipient
 *   recipient_phone:
 *     type: string
 *     description: The phone number of the recipient
 *   notes:
 *     type: string
 *     description: Additional notes for the shipment
 */
export async function createShipment(req: Request, res: Response) {
  const { 
    tracking_number, 
    carrier, 
    shipping_address, 
    recipient_name, 
    recipient_email, 
    recipient_phone, 
    notes 
  } = req.body

  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // Get the current user from the request
  const userId = req.user?.userId || "test-user-id"

  const shipment = await shipmentService.create({
    tracking_number,
    carrier,
    shipping_address,
    recipient_name,
    recipient_email,
    recipient_phone,
    notes,
    user_id: userId,
  })

  res.status(201).json({ shipment })
}

export async function getShipment(req: Request, res: Response) {
  const { id } = req.params
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  const shipment = await shipmentService.retrieve(id)
  
  // Check if the shipment belongs to the current user
  const currentUserId = req.user?.userId || "test-user-id"
  if (shipment.user_id !== currentUserId) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  res.status(200).json({ shipment })
}

export async function listShipments(req: Request, res: Response) {
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // Get shipments for the current user
  const currentUserId = req.user?.userId || "test-user-id"
  const shipments = await shipmentService.listByUser(currentUserId)

  res.status(200).json({ shipments })
}

/**
 * @schema UpdateShipmentRequest
 * type: object
 * properties:
 *   tracking_number:
 *     type: string
 *     description: The tracking number of the shipment
 *   carrier:
 *     type: string
 *     description: The carrier of the shipment
 *   shipping_address:
 *     type: string
 *     description: The shipping address
 *   recipient_name:
 *     type: string
 *     description: The name of the recipient
 *   recipient_email:
 *     type: string
 *     description: The email of the recipient
 *   recipient_phone:
 *     type: string
 *     description: The phone number of the recipient
 *   status:
 *     type: string
 *     description: The status of the shipment
 *   notes:
 *     type: string
 *     description: Additional notes for the shipment
 */
export async function updateShipment(req: Request, res: Response) {
  const { id } = req.params
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // First retrieve the shipment to check ownership
  const existingShipment = await shipmentService.retrieve(id)
  
  // Check if the shipment belongs to the current user
  const currentUserId = req.user?.userId || "test-user-id"
  if (existingShipment.user_id !== currentUserId) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  const {
    tracking_number,
    carrier,
    shipping_address,
    recipient_name,
    recipient_email,
    recipient_phone,
    status,
    notes,
  } = req.body

  const updatedShipment = await shipmentService.update(id, {
    tracking_number,
    carrier,
    shipping_address,
    recipient_name,
    recipient_email,
    recipient_phone,
    status,
    notes,
  })

  res.status(200).json({ shipment: updatedShipment })
}

export async function deleteShipment(req: Request, res: Response) {
  const { id } = req.params
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // First retrieve the shipment to check ownership
  const existingShipment = await shipmentService.retrieve(id)
  
  // Check if the shipment belongs to the current user
  const currentUserId = req.user?.userId || "test-user-id"
  if (existingShipment.user_id !== currentUserId) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  await shipmentService.delete(id)

  res.status(204).send()
}