import React, { useState, useEffect, useRef } from "react";
import AutoSuggestions from "./AutoSuggestions";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  setSubmitted,
  setValid,
  showSuggestions,
  setShowSuggestions,
}) => {
  const initial = useRef(true);
  const [suggestions, setSuggestions] = useState([]);

  if (searchTerm === "") setShowSuggestions(false);

  const Suggestions_AC_Endpoint =
    "https://webhooks.mongodb-realm.com/api/client/v2.0/app/restaurantfinderkeynote-jinvs/service/restaurants/incoming_webhook/getRestaurantsAutocomplete";

  // this is a function definition that calls another function API.fetchContent()
  const fetchAC_Content = async (searchTerm) => {
    let autocomplete_names_endpoint = Suggestions_AC_Endpoint;
    if (searchTerm) {
      console.log("SEARCHTERM", searchTerm);
      autocomplete_names_endpoint =
        autocomplete_names_endpoint + `?restname=${searchTerm}`;
      console.log(autocomplete_names_endpoint);
    }
    try {
      let restaurants = await (await fetch(autocomplete_names_endpoint)).json();
      setSuggestions(restaurants);
      console.log("DID I SET RESTAURANTS?");
      console.log(restaurants);
      console.log(suggestions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    // BUILD OUT AUTOCOMPLETE TERMS

    if (searchTerm !== "" && searchTerm.length > 3) {
      console.log("building out ac terms");
      fetchAC_Content(searchTerm);

      if (suggestions.length !== 0) {
        setShowSuggestions(true);
        return;
      }
      setShowSuggestions(false);
    }
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="relative flex flex-col w-2/3">
      <div className="flex w-3/4 px-3 py-2 mx-auto my-4 text-2xl text-black duration-700 ease-in-out transform bg-white border rounded border-san-juan-300 hover:border-san-juan-700 transition-width hover:shadow-xl hover:w-full active:w-full focus:w-full">
        <div className="my-auto text-6xl"></div>
        <input
          type="text"
          placeholder="restaurants..."
          autoComplete="off"
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          value={searchTerm}
          className="flex-grow w-full px-5 bg-transparent outline-none font-body"
        />
      </div>
      {showSuggestions && (
        <div className="absolute z-10 w-full bg-white rounded shadow-2xl ml-32 text-san-juan-700 top-24 font-body">
          <AutoSuggestions
            items={suggestions}
            showSuggestions={showSuggestions}
            setSuggestions={setSuggestions}
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            setSubmitted={setSubmitted}
            setValid={setValid}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
