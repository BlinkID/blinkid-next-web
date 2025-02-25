/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * `deviceCapabilities` and `streamCapabilities` seem to be the same on iOS Safari
 */
export type ExtendedCameraInfo = {
  inputDeviceInfo: Omit<InputDeviceInfo, "getCapabilities" | "toJSON">;
  deviceCapabilities: ReturnType<InputDeviceInfo["getCapabilities"]>;
  streamCapabilities: ReturnType<MediaStreamTrack["getCapabilities"]>;
  mediaTrackSettings: ReturnType<MediaStreamTrack["getSettings"]>;
};

export type FakeDevice = {
  name: string;
  cameras: ExtendedCameraInfo[];
};

export const fakeDevices = {
  "Samsung S21FE": {
    name: "Samsung S21FE",
    cameras: [
      {
        inputDeviceInfo: {
          deviceId:
            "1e3cf0ccf4d75643caf0078958243a046ae7ae51e230d0eac28a90e66fa8bdcd",
          kind: "videoinput",
          label: "camera2 1, facing front",
          groupId:
            "f3f49d454022ea7dd50594d792d32e04a70d4efd39eb1fb887c34e9e27c8ab78",
        },
        deviceCapabilities: {
          aspectRatio: {
            max: 3264,
            min: 0.0004084967320261438,
          },
          deviceId:
            "1e3cf0ccf4d75643caf0078958243a046ae7ae51e230d0eac28a90e66fa8bdcd",
          facingMode: ["user"],
          frameRate: {
            max: 30,
            min: 1,
          },
          groupId:
            "f3f49d454022ea7dd50594d792d32e04a70d4efd39eb1fb887c34e9e27c8ab78",
          height: {
            max: 2448,
            min: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          width: {
            max: 3264,
            min: 1,
          },
        },
        streamCapabilities: {
          aspectRatio: {
            max: 3264,
            min: 0.0004084967320261438,
          },
          colorTemperature: {
            max: 7000,
            min: 2850,
            step: 50,
          },
          deviceId:
            "1e3cf0ccf4d75643caf0078958243a046ae7ae51e230d0eac28a90e66fa8bdcd",
          exposureCompensation: {
            max: 2,
            min: -2,
            step: 0.10000000149011612,
          },
          exposureMode: ["continuous", "manual"],
          exposureTime: {
            max: 2793.6,
            min: 0.795,
            step: 0.1,
          },
          facingMode: ["user"],
          focusDistance: {
            max: 3.995028018951416,
            min: 0,
            step: 0.009999999776482582,
          },
          focusMode: ["manual"],
          frameRate: {
            max: 30,
            min: 0,
          },
          groupId:
            "f3f49d454022ea7dd50594d792d32e04a70d4efd39eb1fb887c34e9e27c8ab78",
          height: {
            max: 2448,
            min: 1,
          },
          iso: {
            max: 3200,
            min: 50,
            step: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          whiteBalanceMode: ["continuous", "manual"],
          width: {
            max: 3264,
            min: 1,
          },
          zoom: {
            max: 8,
            min: 1,
            step: 0.1,
          },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          colorTemperature: 0,
          deviceId:
            "1e3cf0ccf4d75643caf0078958243a046ae7ae51e230d0eac28a90e66fa8bdcd",
          exposureCompensation: 0,
          exposureMode: "continuous",
          exposureTime: 399.65296,
          facingMode: "user",
          focusDistance: 0.30000001192092896,
          focusMode: "continuous",
          frameRate: 30,
          groupId:
            "f3f49d454022ea7dd50594d792d32e04a70d4efd39eb1fb887c34e9e27c8ab78",
          height: 640,
          iso: 50,
          resizeMode: "none",
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId:
            "a9093293df4501c18a5422abd46ef29559c8f32b529b0a6e51d04265b37daaef",
          kind: "videoinput",
          label: "camera2 3, facing front",
          groupId:
            "4eb24b12efbb6b2da316d8fd7642647607fa501007d9a442c30d42346c1eedb8",
        },
        deviceCapabilities: {
          aspectRatio: {
            max: 2640,
            min: 0.000505050505050505,
          },
          deviceId:
            "a9093293df4501c18a5422abd46ef29559c8f32b529b0a6e51d04265b37daaef",
          facingMode: ["user"],
          frameRate: {
            max: 30,
            min: 1,
          },
          groupId:
            "4eb24b12efbb6b2da316d8fd7642647607fa501007d9a442c30d42346c1eedb8",
          height: {
            max: 1980,
            min: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          width: {
            max: 2640,
            min: 1,
          },
        },
        streamCapabilities: {
          aspectRatio: {
            max: 2640,
            min: 0.000505050505050505,
          },
          colorTemperature: {
            max: 7000,
            min: 2850,
            step: 50,
          },
          deviceId:
            "a9093293df4501c18a5422abd46ef29559c8f32b529b0a6e51d04265b37daaef",
          exposureCompensation: {
            max: 2,
            min: -2,
            step: 0.10000000149011612,
          },
          exposureMode: ["continuous", "manual"],
          exposureTime: {
            max: 2793.6,
            min: 0.795,
            step: 0.1,
          },
          facingMode: ["user"],
          focusDistance: {
            max: 3.995028018951416,
            min: 0,
            step: 0.009999999776482582,
          },
          focusMode: ["manual"],
          frameRate: {
            max: 30,
            min: 0,
          },
          groupId:
            "4eb24b12efbb6b2da316d8fd7642647607fa501007d9a442c30d42346c1eedb8",
          height: {
            max: 1980,
            min: 1,
          },
          iso: {
            max: 3200,
            min: 50,
            step: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          whiteBalanceMode: ["continuous", "manual"],
          width: {
            max: 2640,
            min: 1,
          },
          zoom: {
            max: 8,
            min: 1,
            step: 0.1,
          },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          colorTemperature: 0,
          deviceId:
            "a9093293df4501c18a5422abd46ef29559c8f32b529b0a6e51d04265b37daaef",
          exposureCompensation: 0,
          exposureMode: "continuous",
          exposureTime: 399.65296,
          facingMode: "user",
          focusDistance: 0.30000001192092896,
          focusMode: "continuous",
          frameRate: 30,
          groupId:
            "4eb24b12efbb6b2da316d8fd7642647607fa501007d9a442c30d42346c1eedb8",
          height: 640,
          iso: 50,
          resizeMode: "none",
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId:
            "c9264fb2344b2bb8d5d58095ceadf1b5a9258dd7eabfc7ae02f5bd878dfa0259",
          kind: "videoinput",
          label: "camera2 2, facing back",
          groupId:
            "9096a69a3a5a57114326932a07492fbeeacff328ad1de24af6b05c9c14bf3b21",
        },
        deviceCapabilities: {
          aspectRatio: {
            max: 4000,
            min: 0.0003333333333333333,
          },
          colorTemperature: {
            max: 7000,
            min: 2850,
            step: 50,
          },
          deviceId:
            "c9264fb2344b2bb8d5d58095ceadf1b5a9258dd7eabfc7ae02f5bd878dfa0259",
          exposureCompensation: {
            max: 2,
            min: -2,
            step: 0.10000000149011612,
          },
          exposureMode: ["continuous", "manual"],
          exposureTime: {
            max: 6746.07955,
            min: 0.10667,
            step: 0.1,
          },
          facingMode: ["environment"],
          focusDistance: {
            max: 0.614366888999939,
            min: 0,
            step: 0.009999999776482582,
          },
          focusMode: ["manual"],
          frameRate: {
            max: 30,
            min: 0,
          },
          groupId:
            "9096a69a3a5a57114326932a07492fbeeacff328ad1de24af6b05c9c14bf3b21",
          height: {
            max: 3000,
            min: 1,
          },
          iso: {
            max: 800,
            min: 50,
            step: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          whiteBalanceMode: ["continuous", "manual"],
          width: {
            max: 4000,
            min: 1,
          },
          zoom: {
            max: 8,
            min: 1,
            step: 0.1,
          },
        },
        streamCapabilities: {
          aspectRatio: {
            max: 4000,
            min: 0.0003333333333333333,
          },
          colorTemperature: {
            max: 7000,
            min: 2850,
            step: 50,
          },
          deviceId:
            "c9264fb2344b2bb8d5d58095ceadf1b5a9258dd7eabfc7ae02f5bd878dfa0259",
          exposureCompensation: {
            max: 2,
            min: -2,
            step: 0.10000000149011612,
          },
          exposureMode: ["continuous", "manual"],
          exposureTime: {
            max: 6746.07955,
            min: 0.10667,
            step: 0.1,
          },
          facingMode: ["environment"],
          focusDistance: {
            max: 0.614366888999939,
            min: 0,
            step: 0.009999999776482582,
          },
          focusMode: ["manual"],
          frameRate: {
            max: 30,
            min: 0,
          },
          groupId:
            "9096a69a3a5a57114326932a07492fbeeacff328ad1de24af6b05c9c14bf3b21",
          height: {
            max: 3000,
            min: 1,
          },
          iso: {
            max: 800,
            min: 50,
            step: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          whiteBalanceMode: ["continuous", "manual"],
          width: {
            max: 4000,
            min: 1,
          },
          zoom: {
            max: 8,
            min: 1,
            step: 0.1,
          },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          colorTemperature: 0,
          deviceId:
            "c9264fb2344b2bb8d5d58095ceadf1b5a9258dd7eabfc7ae02f5bd878dfa0259",
          exposureCompensation: 0,
          exposureMode: "continuous",
          exposureTime: 666.696,
          facingMode: "environment",
          focusDistance: 1,
          focusMode: "continuous",
          frameRate: 30,
          groupId:
            "9096a69a3a5a57114326932a07492fbeeacff328ad1de24af6b05c9c14bf3b21",
          height: 640,
          iso: 50,
          resizeMode: "none",
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId:
            "44cb06f4280e9cb4b0ec578b1d3df74ca6f0df5734b3ff28d2aba6d6204efff4",
          kind: "videoinput",
          label: "camera2 0, facing back",
          groupId:
            "795036806e7e8e4ab7c1a2f130d833013d19ba5631814f2a615bfccb11b282bf",
        },
        deviceCapabilities: {
          aspectRatio: {
            max: 4000,
            min: 0.0003333333333333333,
          },
          deviceId:
            "44cb06f4280e9cb4b0ec578b1d3df74ca6f0df5734b3ff28d2aba6d6204efff4",
          facingMode: ["environment"],
          frameRate: {
            max: 30,
            min: 1,
          },
          groupId:
            "795036806e7e8e4ab7c1a2f130d833013d19ba5631814f2a615bfccb11b282bf",
          height: {
            max: 3000,
            min: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          width: {
            max: 4000,
            min: 1,
          },
        },
        streamCapabilities: {
          aspectRatio: {
            max: 4000,
            min: 0.0003333333333333333,
          },
          colorTemperature: {
            max: 7000,
            min: 2850,
            step: 50,
          },
          deviceId:
            "44cb06f4280e9cb4b0ec578b1d3df74ca6f0df5734b3ff28d2aba6d6204efff4",
          exposureCompensation: {
            max: 2,
            min: -2,
            step: 0.10000000149011612,
          },
          exposureMode: ["continuous", "manual"],
          exposureTime: {
            max: 1467,
            min: 0.57508,
            step: 0.1,
          },
          facingMode: ["environment"],
          focusDistance: {
            max: 4.500000476837158,
            min: 0.10000000149011612,
            step: 0.009999999776482582,
          },
          focusMode: ["manual", "single-shot", "continuous"],
          frameRate: {
            max: 30,
            min: 0,
          },
          groupId:
            "795036806e7e8e4ab7c1a2f130d833013d19ba5631814f2a615bfccb11b282bf",
          height: {
            max: 3000,
            min: 1,
          },
          iso: {
            max: 3200,
            min: 50,
            step: 1,
          },
          resizeMode: ["none", "crop-and-scale"],
          torch: true,
          whiteBalanceMode: ["continuous", "manual"],
          width: {
            max: 4000,
            min: 1,
          },
          zoom: {
            max: 8,
            min: 1,
            step: 0.1,
          },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          colorTemperature: 0,
          deviceId:
            "44cb06f4280e9cb4b0ec578b1d3df74ca6f0df5734b3ff28d2aba6d6204efff4",
          exposureCompensation: 0,
          exposureMode: "continuous",
          exposureTime: 666.696,
          facingMode: "environment",
          focusDistance: 0.10000000149011612,
          focusMode: "continuous",
          frameRate: 30,
          groupId:
            "795036806e7e8e4ab7c1a2f130d833013d19ba5631814f2a615bfccb11b282bf",
          height: 640,
          iso: 50,
          resizeMode: "none",
          torch: false,
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
    ],
  },
  "iPhone 15": {
    name: "iPhone 15",
    cameras: [
      {
        inputDeviceInfo: {
          deviceId: "A40001F4D7E10F79FA433232C9C7D38618464CD0",
          kind: "videoinput",
          label: "Front Camera",
          groupId: "D9EF825D97E6E89B37849195F01B5D7CD422882F",
        },
        deviceCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "1EB0A6AE3BA8BD299F65896B05C88DFF796C5B14",
          facingMode: ["user"],
          focusDistance: { min: 0.2 },
          frameRate: { max: 60, min: 1 },
          groupId: "D9EF825D97E6E89B37849195F01B5D7CD422882F",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        streamCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "A40001F4D7E10F79FA433232C9C7D38618464CD0",
          facingMode: ["user"],
          focusDistance: { min: 0.2 },
          frameRate: { max: 60, min: 1 },
          groupId: "D9EF825D97E6E89B37849195F01B5D7CD422882F",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        mediaTrackSettings: {
          aspectRatio: 1.3333333333333333,
          backgroundBlur: false,
          deviceId: "A40001F4D7E10F79FA433232C9C7D38618464CD0",
          facingMode: "user",
          frameRate: 30,
          groupId: "D9EF825D97E6E89B37849195F01B5D7CD422882F",
          height: 480,
          powerEfficient: false,
          whiteBalanceMode: "continuous",
          width: 640,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId: "35A2103CDE4135EC880EF56FA50F09CEA486517E",
          kind: "videoinput",
          label: "Back Dual Wide Camera",
          groupId: "5936BE84D4268CDD407066152C79B863DC4A44F0",
        },
        deviceCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "15FC85FACECE0DD790EBC102441373D123A4F9B2",
          facingMode: ["environment"],
          focusDistance: { min: 0.15 },
          frameRate: { max: 60, min: 1 },
          groupId: "5936BE84D4268CDD407066152C79B863DC4A44F0",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 0.5 },
        },
        streamCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "35A2103CDE4135EC880EF56FA50F09CEA486517E",
          facingMode: ["environment"],
          focusDistance: { min: 0.15 },
          frameRate: { max: 60, min: 1 },
          groupId: "5936BE84D4268CDD407066152C79B863DC4A44F0",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 0.5 },
        },
        mediaTrackSettings: {
          aspectRatio: 1.3333333333333333,
          backgroundBlur: false,
          deviceId: "35A2103CDE4135EC880EF56FA50F09CEA486517E",
          facingMode: "environment",
          frameRate: 30,
          groupId: "5936BE84D4268CDD407066152C79B863DC4A44F0",
          height: 480,
          powerEfficient: false,
          torch: false,
          whiteBalanceMode: "continuous",
          width: 640,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId: "D92E8E64063C9E5CA94CF208CAE26D4664D741BA",
          kind: "videoinput",
          label: "Back Ultra Wide Camera",
          groupId: "80FE5A40498FE7ED76D6089A1EE742E7D2ECB6C5",
        },
        deviceCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "769D142A0F80725446896FD68069A2D6221D86CC",
          facingMode: ["environment"],
          frameRate: { max: 60, min: 1 },
          groupId: "80FE5A40498FE7ED76D6089A1EE742E7D2ECB6C5",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        streamCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "D92E8E64063C9E5CA94CF208CAE26D4664D741BA",
          facingMode: ["environment"],
          frameRate: { max: 60, min: 1 },
          groupId: "80FE5A40498FE7ED76D6089A1EE742E7D2ECB6C5",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          backgroundBlur: false,
          deviceId: "D92E8E64063C9E5CA94CF208CAE26D4664D741BA",
          facingMode: "environment",
          frameRate: 30,
          groupId: "80FE5A40498FE7ED76D6089A1EE742E7D2ECB6C5",
          height: 640,
          powerEfficient: false,
          torch: false,
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
      {
        inputDeviceInfo: {
          deviceId: "3650731609863BA17CC92C7A0CF828BA509693D7",
          kind: "videoinput",
          label: "Back Camera",
          groupId: "446DBB688D857AA5B70D0565A3BB847E00DA545E",
        },
        deviceCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "50E8BB7306174533AD7062C728D4AF86264AB19E",
          facingMode: ["environment"],
          focusDistance: { min: 0.15 },
          frameRate: { max: 60, min: 1 },
          groupId: "446DBB688D857AA5B70D0565A3BB847E00DA545E",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        streamCapabilities: {
          aspectRatio: { max: 4032, min: 0.00033068783068783067 },
          backgroundBlur: [false],
          deviceId: "3650731609863BA17CC92C7A0CF828BA509693D7",
          facingMode: ["environment"],
          focusDistance: { min: 0.15 },
          frameRate: { max: 60, min: 1 },
          groupId: "446DBB688D857AA5B70D0565A3BB847E00DA545E",
          height: { max: 3024, min: 1 },
          powerEfficient: [false, true],
          torch: true,
          whiteBalanceMode: ["manual", "continuous"],
          width: { max: 4032, min: 1 },
          zoom: { max: 10, min: 1 },
        },
        mediaTrackSettings: {
          aspectRatio: 0.75,
          backgroundBlur: false,
          deviceId: "3650731609863BA17CC92C7A0CF828BA509693D7",
          facingMode: "environment",
          frameRate: 30,
          groupId: "446DBB688D857AA5B70D0565A3BB847E00DA545E",
          height: 640,
          powerEfficient: false,
          torch: false,
          whiteBalanceMode: "continuous",
          width: 480,
          zoom: 1,
        },
      },
    ],
  },
} as const satisfies Record<string, FakeDevice>;
