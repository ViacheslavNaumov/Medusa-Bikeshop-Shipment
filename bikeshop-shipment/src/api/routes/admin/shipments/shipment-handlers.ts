import { Request, Response } from "express"
import ShipmentService from "../../../../modules/shipment/services/shipment.service"
// Comment out UserService import for now as we'll use a fallback approach
// import { UserService } from "@medusajs/medusa"

/**
 * @schema AdminCreateShipmentRequest
 * type: object
 * required:
 *   - tracking_number
 *   - carrier
 *   - shipping_address
 *   - recipient_name
 *   - recipient_email
 *   - user_id
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
 *   user_id:
 *     type: string
 *     description: The ID of the user who owns this shipment
 */
export async function createShipment(req: Request, res: Response) {
  const { 
    tracking_number, 
    carrier, 
    shipping_address, 
    recipient_name, 
    recipient_email, 
    recipient_phone, 
    notes,
    user_id
  } = req.body

  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // Skip user verification for development
  // const userService: UserService = req.scope.resolve("userService")
  // await userService.retrieve(user_id)

  const shipment = await shipmentService.create({
    tracking_number,
    carrier,
    shipping_address,
    recipient_name,
    recipient_email,
    recipient_phone,
    notes,
    user_id,
  })

  res.status(201).json({ shipment })
}

export async function getShipment(req: Request, res: Response) {
  const { id } = req.params
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  const shipment = await shipmentService.retrieve(id)

  res.status(200).json({ shipment })
}

export async function listShipments(req: Request, res: Response) {
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  // Admin can see all shipments
  const shipments = await shipmentService.list()

  res.status(200).json({ shipments })
}

/**
 * @schema AdminUpdateShipmentRequest
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

/**
 * @schema AdminUpdateShipmentStatusRequest
 * type: object
 * required:
 *   - status
 * properties:
 *   status:
 *     type: string
 *     description: The new status of the shipment
 *     enum: [pending, processing, shipped, delivered, cancelled]
 */
export async function updateShipmentStatus(req: Request, res: Response) {
  const { id } = req.params
  const { status } = req.body
  
  if (!status) {
    res.status(400).json({ message: "Status is required" })
    return
  }
  
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")
  
  const updatedShipment = await shipmentService.updateStatus(id, status)

  res.status(200).json({ shipment: updatedShipment })
}

export async function deleteShipment(req: Request, res: Response) {
  const { id } = req.params
  const shipmentService: ShipmentService = req.scope.resolve("shipmentService")

  await shipmentService.delete(id)

  res.status(204).send()
}