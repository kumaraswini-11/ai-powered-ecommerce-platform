import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./category-type";
import { customerType } from "./customer-type";
import { orderType } from "./order-type";
import { productType } from "./product-type";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [customerType, orderType, productType, categoryType],
};
