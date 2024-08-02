"use client";
// app/routes/account.tsx
//import { Form, useActionData, json, ActionFunction } from ;
import { ActionFunction, json } from "@remix-run/node";
import {  useActionData } from "@remix-run/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import NavBar from "~/navbar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})




export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let username = formData.get("username");
  let email = formData.get("email");
  let password = formData.get("password");

  // Perform your backend logic here, e.g., create the account, validate data, etc.

  return json({ username, email, password });
};

export default function AccountPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email : "",
    },
  })
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  const actionData = useActionData();

  return (
    <div className = "bg-white">
      <NavBar />
    <div className="flex flex-row items-center justify-center  pt-24 px-5 bg-white">
    <div className="w-full max-w-3xl">
      <h1 className="text-left text-4xl mb-5 font-bold">Account Page</h1>
      <div className="flex gap-10 items-center justify-center">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-col gap-20 max-w-lg w-auto h-auto" >
      <div className = "flex flex-row gap-10 max-width-1000 ">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name </FormLabel>
              <FormControl>
                <Input placeholder="john" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField 
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name </FormLabel>
              <FormControl>
                <Input placeholder="doe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
       </div>
       
        <FormField 
          control={form.control}
          name= "email"
          render={({ field }) => (
            <FormItem style={{ marginTop: '20px' }}>
              <FormLabel>Email Address </FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormDescription>
              Your email address for communication.
              </FormDescription>
              <FormMessage />
            </FormItem>

          )}
        />
        <FormField 
          control={form.control}
          name= "password"
          render={({ field }) => (
            <FormItem style={{ marginTop: '20px' }}>
              <FormLabel>Password </FormLabel>
              <FormControl>
                <Input type = "password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
              Choose a strong password.
              </FormDescription>
              <FormMessage />
            </FormItem>

          )}
        />
      <div className="flex justify-center">
      <Button type="submit" className=" w-full bg-primary text-primary-foreground" style={{ marginTop: '20px' }}>Submit</Button>
      </div>
      </form>
    </Form>
    <div className= "w-1/2 flex justify-center">
      <img className="h-auto w-80 -mt-8 object-cover " style={{ borderRadius: '10px', marginTop: '-60px' }} src="/profile.png"
               alt="profile pic"
              />
      </div>
      </div>
    </div>
    </div>
    </div>
  
);
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    paddingTop: '100px',
    paddingLeft: '20px',
    paddingRight: '20px',
    backgroundColor: '#ffffff',
  },
  container: {
    width: '100%',
    maxWidth: '1000px', // Adjust as needed
  },
  heading: {
    textAlign: 'left' as const,
    marginBottom: '20px',
    fontSize: '32px',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'row' as 'row', // Ensure Flexbox is applied
    gap: '20px', // Space between forms
    alignItems: 'flex-start' as 'flex-start', // Align forms to the top
    width: '100%',
    overflowX: 'auto' as 'auto',
  },
  form: {
    width: '100%',
    maxWidth: '450px', // Adjust as needed
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left' as const,
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    paddingLeft: '175px',

   
  },
  result: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
  },
};