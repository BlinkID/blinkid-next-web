/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { StringResult } from "./StringResult";
import { VehicleClassInfo } from "./VehicleClassInfo";

/**
 * Driver's license specific data.
 */

export interface DriverLicenseDetailedInfo {
  /** The driver license conditions. */
  conditions: StringResult;

  /**
   * The restrictions to driving privileges for the driver license owner.
   */
  restrictions: StringResult;

  /**
   * The additional privileges granted to the driver license owner.
   */
  endorsements: StringResult;

  /**
   * The type of vehicle the driver license owner has privilege to drive.
   */
  vehicleClass: StringResult;

  /**
   * The additional information on vehicle class.
   */
  vehicleClassesInfo: Array<VehicleClassInfo>;
}
