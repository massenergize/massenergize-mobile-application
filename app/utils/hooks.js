import { useState, useEffect } from 'react';
import { apiCall } from '../api/functions';

// custom hook to get information from a single API call, takes a route and any arguments
// often used for details pages (ie. actions, events, vendors, testimonials, teams)
export const useDetails = (route, args) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      console.log("Fetching Details");
      apiCall(route, args).then((json) => {
        if (json.success) {
            setData(json.data);
        } else {
            console.log(json);
        }
        setIsLoading(false);
      });
    }, [])
  
    return [data, isLoading];
  }