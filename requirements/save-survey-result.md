# Answer Survey

> ## Success case:
1. ⛔️ Receives a **PUT** request in the route **/api/surveys/{survey_id}/results**
2. ⛔️ Validate whether the request was made by an **user**
3. ✅ Validate the **survey_id** parameter
4. ✅ Validates that the **answer** field is a valid answer
5. ✅ **Create** a survey result with the data provided if there is no registry
6. ✅ **Updates** a survey result with the data provided if there is already a registry
7. ⛔️ Returns **200** with survey result data

> ## Exceptions:
1. ⛔️ Returns error **404** if the API does not exist
2. ⛔️ Returns error **403** if the request was not made by an user
3. ✅ Returns error **403** if the survey_id passed in the URL is invalid
4. ✅ Returns error **403** if the response sent by the client is an invalid response
5. ✅ Returns error **500** if there is an error when trying to create the survey result
6. ✅ Returns error **500** if there is an error when trying to update the survey results
7. ✅ Returns error **500** if there is an error when trying to load the survey
