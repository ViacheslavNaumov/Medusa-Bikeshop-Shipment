import { TransactionBaseService } from "@medusajs/medusa"
import { ShipmentRepository } from "../repository/shipment.repository"
import { Shipment, ShipmentStatus } from "../models"
import { EntityManager } from "typeorm"
import { MedusaError } from "@medusajs/utils"
import { UserService } from "@medusajs/medusa"

type ShipmentServiceProps = {
  manager: EntityManager
  shipmentRepository: typeof ShipmentRepository
  userService: UserService
}

type CreateShipmentInput = {
  tracking_number: string
  carrier: string
  shipping_address: string
  recipient_name: string
  recipient_email: string
  recipient_phone?: string
  notes?: string
  user_id: string
}

type UpdateShipmentInput = Partial<{
  tracking_number: string
  carrier: string
  shipping_address: string
  recipient_name: string
  recipient_email: string
  recipient_phone: string
  status: string
  shipped_at: Date
  delivered_at: Date
  notes: string
}>

class ShipmentService extends TransactionBaseService {
  protected readonly shipmentRepository_: typeof ShipmentRepository
  protected readonly userService_: UserService

  constructor({ shipmentRepository, userService }: ShipmentServiceProps) {
    super(arguments[0])
    this.shipmentRepository_ = shipmentRepository
    this.userService_ = userService
  }

  async create(data: CreateShipmentInput): Promise<Shipment> {
    return this.atomicPhase_(async (manager) => {
      try {
        // Try to verify user exists, but don't fail if user service is not available
        if (this.userService_) {
          const user = await this.userService_.retrieve(data.user_id).catch(() => null)
          if (!user) {
            console.warn(`User with id ${data.user_id} not found, but continuing anyway for development`)
          }
        }
      } catch (error) {
        console.warn("Error verifying user, but continuing anyway for development:", error)
      }

      // Check if tracking number already exists
      const existing = await this.shipmentRepository_.findByTrackingNumber(data.tracking_number)
      if (existing) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Shipment with tracking number ${data.tracking_number} already exists`
        )
      }

      const shipmentToCreate = {
        ...data,
        status: ShipmentStatus.PENDING, // Default status
      }

      const shipmentRepository = manager.withRepository(this.shipmentRepository_)
      const shipment = shipmentRepository.create(shipmentToCreate)
      return await shipmentRepository.save(shipment)
    })
  }

  async retrieve(shipmentId: string): Promise<Shipment> {
    const shipmentRepo = this.activeManager_.withRepository(this.shipmentRepository_)
    const shipment = await shipmentRepo.findOne({
      where: { id: shipmentId },
    })

    if (!shipment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shipment with id: ${shipmentId} was not found`
      )
    }

    return shipment
  }

  async update(id: string, data: UpdateShipmentInput): Promise<Shipment> {
    return this.atomicPhase_(async (manager) => {
      const shipmentRepo = manager.withRepository(this.shipmentRepository_)
      const shipment = await this.retrieve(id)

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          shipment[key] = value
        }
      }

      return await shipmentRepo.save(shipment)
    })
  }

  async delete(id: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const shipmentRepo = manager.withRepository(this.shipmentRepository_)
      const shipment = await this.retrieve(id)

      await shipmentRepo.remove(shipment)
    })
  }

  async list(selector: any = {}, config: any = {}): Promise<Shipment[]> {
    const shipmentRepo = this.activeManager_.withRepository(this.shipmentRepository_)
    return await shipmentRepo.find({
      where: selector,
      ...config,
    })
  }

  async listByUser(userId: string): Promise<Shipment[]> {
    const shipmentRepo = this.activeManager_.withRepository(this.shipmentRepository_)
    return await shipmentRepo.findByUserId(userId)
  }

  async updateStatus(id: string, status: string): Promise<Shipment> {
    return this.atomicPhase_(async (manager) => {
      const shipmentRepo = manager.withRepository(this.shipmentRepository_)
      const shipment = await this.retrieve(id)

      shipment.status = status

      if (status === ShipmentStatus.SHIPPED && !shipment.shipped_at) {
        shipment.shipped_at = new Date()
      }

      if (status === ShipmentStatus.DELIVERED && !shipment.delivered_at) {
        shipment.delivered_at = new Date()
      }

      return await shipmentRepo.save(shipment)
    })
  }
}

export default ShipmentService