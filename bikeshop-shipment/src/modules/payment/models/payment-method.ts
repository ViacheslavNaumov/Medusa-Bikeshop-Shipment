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

@Entity()
export class PaymentMethod extends BaseEntity {
  @Column({ type: "varchar" })
  provider: string

  @Column({ type: "varchar" })
  provider_id: string

  @Column({ type: "varchar", nullable: true })
  card_last4: string

  @Column({ type: "varchar", nullable: true })
  card_brand: string

  @Column({ type: "varchar", nullable: true })
  card_exp_month: string

  @Column({ type: "varchar", nullable: true })
  card_exp_year: string

  @Column({ type: "boolean", default: false })
  is_default: boolean

  @Index()
  @Column()
  user_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "paym")
  }
}