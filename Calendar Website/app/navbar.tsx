import { Form, Link } from "@remix-run/react";
import React from 'react';
import { Button } from "@/components/ui/button"


const NavBar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" ><img 
              src="/launch.png" // Path to your logo image
              alt="Website Logo" 
              className="h-8" // Adjust size as needed
            /></Link>
        </div>
        <div className="flex space-x-4">
          
          <Link to="/notes"  className="text-gray-600 hover:text-gray-900">Events</Link>
          <Link to="/account" className="text-gray-600 hover:text-gray-900">Account</Link>
          <Form action="/logout" method="post">
          <Button type="submit" className=" w-full bg-primary text-primary-foreground hover:bg-gray-600" style={{ marginTop: '-10px' }}>Logout</Button>
        </Form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
