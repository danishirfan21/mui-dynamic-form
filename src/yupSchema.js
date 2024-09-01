import * as yup from "yup";

const blogPostSchema = yup.object().shape({
  blogPostBody: yup.string().required("Body is required"),
  blogPostTags: yup.string().required("Tags are required"),
});

const productListingSchema = yup.object().shape({
  productName: yup.string().required("Product Name is required"),
  price: yup
    .string()
    .required("Price is required")
    .test(
      "is-number",
      "Price must be a number",
      (value) => !isNaN(parseFloat(value)) && isFinite(value)
    )
    .test(
      "is-positive",
      "Price must be a positive number",
      (value) => parseFloat(value) > 0
    )
    .test(
      "min-value",
      "Price must be at least 1",
      (value) => parseFloat(value) >= 1
    ),
  category: yup.string().required("Category is required"),
});

const eventSchema = yup.object().shape({
  eventDate: yup
    .date()
    .required("Event Date is required")
    .typeError("Please enter a valid date"),
  location: yup.string().required("Location is required"),
  description: yup.string().required("Description is required"),
});

export const schema = yup.lazy((values) => {
  const baseSchema = {
    contentType: yup.string().required("Content type is required"),
    title: yup.string().required("Title is required"),
    author: yup.string().required("Author is required"),
  };

  switch (values.contentType) {
    case "Blog Post":
    case undefined:
      return yup.object({
        ...baseSchema,
        blogPosts: yup
          .array()
          .of(blogPostSchema)
          .min(1, "At least one blog post is required"),
      });
    case "Product Listing":
      return yup.object({
        ...baseSchema,
        productListings: yup
          .array()
          .of(productListingSchema)
          .min(1, "At least one product listing is required"),
      });
    case "Event":
      return yup.object({
        ...baseSchema,
        events: yup
          .array()
          .of(eventSchema)
          .min(1, "At least one event is required"),
      });
    default:
      return yup.object(baseSchema);
  }
});
