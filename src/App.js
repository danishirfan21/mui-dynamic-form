import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { FormHelperText, Select } from "@mui/material";
import { Fragment } from "react";
import { ContentTypes, ProductListingsCategories } from "./data";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./yupSchema";

const defaultTheme = createTheme();

export default function App() {
  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      blogPosts: [{ blogPostBody: "", blogPostTags: "" }],
      productListings: [{ productName: "", price: "", category: "" }],
      events: [{ eventDate: "", location: "", description: "" }],
    },
  });

  const blogPostFields = useFieldArray({ name: "blogPosts", control });
  const productListingFields = useFieldArray({
    name: "productListings",
    control,
  });
  const eventFields = useFieldArray({ name: "events", control });

  function onSubmit(data) {
    const { contentType, blogPosts, productListings, events, ...rest } = data;

    let filteredData = { ...rest, contentType };

    switch (contentType) {
      case "Blog Post":
        filteredData.blogPosts = blogPosts;
        break;
      case "Product Listing":
        filteredData.productListings = productListings;
        break;
      case "Event":
        filteredData.events = events;
        break;
      default:
        break;
    }

    console.log("On Submit data:", filteredData);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <DynamicFormIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create New Content
          </Typography>
          <Box sx={{ mt: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="contentType"
                    control={control}
                    defaultValue="Blog Post"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Content Type"
                      >
                        {ContentTypes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <FormHelperText error>
                    {errors?.contentType?.message}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Title" />
                    )}
                  />
                  <FormHelperText error>
                    {errors?.title?.message}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="author"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Author" />
                    )}
                  />
                  <FormHelperText error>
                    {errors?.author?.message}
                  </FormHelperText>
                </Grid>

                {(watch("contentType") === "Blog Post" ||
                  !watch("contentType")) && (
                  <>
                    {blogPostFields.fields.map((field, index) => (
                      <Fragment key={field.id}>
                        <Grid item xs={12}>
                          <Controller
                            name={`blogPosts.${index}.blogPostBody`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Body"
                                multiline
                                rows={4}
                              />
                            )}
                          />
                          <FormHelperText error>
                            {errors?.blogPosts?.[index]?.blogPostBody?.message}
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            name={`blogPosts.${index}.blogPostTags`}
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} fullWidth label="Tags" />
                            )}
                          />
                          <FormHelperText error>
                            {errors?.blogPosts?.[index]?.blogPostTags?.message}
                          </FormHelperText>
                        </Grid>

                        {blogPostFields.fields.length > 1 && (
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="error"
                              fullWidth
                              onClick={() => blogPostFields.remove(index)}
                            >
                              Remove
                            </Button>
                          </Grid>
                        )}
                      </Fragment>
                    ))}

                    {blogPostFields.fields.length < 5 && (
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() =>
                            blogPostFields.append({
                              blogPostBody: "",
                              blogPostTags: "",
                            })
                          }
                        >
                          Add
                        </Button>
                      </Grid>
                    )}
                  </>
                )}

                {watch("contentType") === "Product Listing" && (
                  <>
                    {productListingFields.fields.map((field, index) => (
                      <Fragment key={field.id}>
                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Product Name"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                            control={control}
                            name={`productListings.${index}.productName`}
                          />
                          <FormHelperText error>
                            {
                              errors?.productListings?.[index]?.productName
                                ?.message
                            }
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Price"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                            name={`productListings.${index}.price`}
                            control={control}
                          />
                          <FormHelperText error>
                            {errors?.productListings?.[index]?.price?.message}
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                label="Category"
                                variant="outlined"
                                fullWidth
                              >
                                {ProductListingsCategories.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                            control={control}
                            name={`productListings.${index}.category`}
                          />
                          <FormHelperText error>
                            {
                              errors?.productListings?.[index]?.category
                                ?.message
                            }
                          </FormHelperText>
                        </Grid>

                        {productListingFields.fields.length > 1 && (
                          <Grid item xs={12}>
                            <Button
                              onClick={() => productListingFields.remove(index)}
                              variant="contained"
                              fullWidth
                              color="secondary"
                            >
                              Remove
                            </Button>
                          </Grid>
                        )}
                      </Fragment>
                    ))}

                    {productListingFields.fields.length < 5 && (
                      <Grid item xs={12}>
                        <Button
                          onClick={() =>
                            productListingFields.append({
                              productName: "",
                              price: "",
                              category: "",
                            })
                          }
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          Add
                        </Button>
                      </Grid>
                    )}
                  </>
                )}

                {watch("contentType") === "Event" && (
                  <>
                    {eventFields.fields.map((field, index) => (
                      <Fragment key={field.id}>
                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Event Date"
                                type="date"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                            control={control}
                            name={`events.${index}.eventDate`}
                          />
                          <FormHelperText error>
                            {errors?.events?.[index]?.eventDate?.message}
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Location"
                                variant="outlined"
                                fullWidth
                              />
                            )}
                            control={control}
                            name={`events.${index}.location`}
                          />
                          <FormHelperText error>
                            {errors?.events?.[index]?.location?.message}
                          </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                          <Controller
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Description"
                                variant="outlined"
                                multiline
                                rows={4}
                                fullWidth
                              />
                            )}
                            control={control}
                            name={`events.${index}.description`}
                          />
                          <FormHelperText error>
                            {errors?.events?.[index]?.description?.message}
                          </FormHelperText>
                        </Grid>

                        {eventFields.fields.length > 1 && (
                          <Grid item xs={12}>
                            <Button
                              onClick={() => eventFields.remove(index)}
                              variant="contained"
                              color="secondary"
                              fullWidth
                            >
                              Remove
                            </Button>
                          </Grid>
                        )}
                      </Fragment>
                    ))}

                    {eventFields.fields.length < 5 && (
                      <Grid item xs={12}>
                        <Button
                          onClick={() =>
                            eventFields.append({
                              eventDate: "",
                              location: "",
                              description: "",
                            })
                          }
                          variant="outlined"
                          color="primary"
                          fullWidth
                        >
                          Add
                        </Button>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
              <Box sx={{ m: "5em auto" }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
