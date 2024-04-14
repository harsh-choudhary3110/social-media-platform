import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploder from "../shared/FileUploder";
import { postValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/quires&mutation";
import Loader from "../shared/Loader";

type PostFormProps = {
  action?: "Create" | "Update";
  post?: Models.Document;
};

const PostForm = ({ action, post }: PostFormProps) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Define form.
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof postValidation>) => {
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      });

      if (!updatedPost) {
        return toast({ title: "Please try again" });
      }

      return navigate(`/posts/${post.$id}`);
    } else {
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });

      if (!newPost) {
        return toast({ title: "Could't create post. Please try again" });
      }

      return navigate("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploder
                  fieldChage={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Taggs (saparated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Art, Learn, Travel"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              `${action} Post`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
