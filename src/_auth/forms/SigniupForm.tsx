import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { signUpValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/quires&mutation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const { setIsAuthenticated } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createUserAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const [seePassword, setSeePassword] = useState<boolean>(false);

  const handleSeePassword = () => {
    setSeePassword((prev) => !prev);
  };

  // Define form
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpValidation>) => {
    setIsLoading(true);

    const newUser = await createUserAccount(values);
    if (!newUser) {
      setIsLoading(false);
      return toast({ title: "Signup Failed. Please try again" });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      setIsLoading(false);
      return toast({ title: "Signup Success. Please Signin your account" });
    }

    form.reset();
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="sanpgram" />
        <h2 className="h3-bold md:m2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md-base-regular mt-2 ">
          To use Snapgram, please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="shad-input-password">
                    <Input
                      type={seePassword ? "text" : "password"}
                      className="shad-input"
                      {...field}
                    />
                    <img
                      className="eye-icon"
                      src="/assets/icons/eye.png"
                      alt="see password"
                      onClick={handleSeePassword}
                    />
                  </div>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary-500">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
