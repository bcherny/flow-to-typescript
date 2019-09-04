/* @flow */

import type A from "./a"
import type { B } from "./b"
import type { C, D } from "./c"
import type E, { F, G } from "./d"

export type { E as F }
