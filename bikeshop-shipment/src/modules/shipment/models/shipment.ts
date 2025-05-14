import { 
  BeforeInsert, 
  Column, 
  Entity, 
  Index, 
  JoinColumn, 
  ManyToOne 
} from "typeorm"

import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { User } from "@medusajs/medusa"

export enum ShipmentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

@Entity()
export class Shipment extends BaseEntity {
  @Column({ type: "varchar" })
  @Index()
  tracking_number: string

  @Column({ type: "varchar" })
  carrier: string

  @Column({ type: "varchar" })
  shipping_address: string

  @Column({ type: "varchar" })
  recipient_name: string

  @Column({ type: "varchar" })
  recipient_email: string

  @Column({ type: "varchar", nullable: true })
  recipient_phone: string

  @Column({ 
    type: "varchar",
    default: ShipmentStatus.PENDING
  })
  status: string

  @Column({ type: "timestamp", nullable: true })
  shipped_at: Date

  @Column({ type: "timestamp", nullable: true })
  delivered_at: Date

  @Column({ type: "varchar", nullable: true })
  notes: string

  @Index()
  @Column()
  user_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ship")
  }
}