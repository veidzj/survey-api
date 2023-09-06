# Load Surveys

> ## Success case:
1. ⛔️ Receives a **GET** type request on the route **/api/surveys**
2. ⛔️ Validate if the request was made by a **user**
3. ✅ Returns **204** if there is no survey
4. ✅ Returns **200** with survey data

> ## Exceptions:
1. ⛔️ Returns **404** error if API does not exist
2. ⛔️ Returns **403** error if not a user
3. ✅ Returns error **500** if there is an error when trying to list the surveys
