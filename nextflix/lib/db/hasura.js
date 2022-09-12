/*
This is an example snippet - you should consider tailoring it
to your service.
*/

export async function queryHasuraGQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      // "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjYyOTg3MDU3LCJleHAiOjk2NjI5ODcwNTcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJzcG9uZ2Vib2IifX0.elt8tUP3vQlzsdw75uuqIvTQpaniAHvCuFsM8Efhq1I",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

// function fetchMyQuery() {
//   const operationsDoc = `
//         query MyQuery {
//           users {
//             email
//             id
//             issuer
//             publicAddress
//           }
//         }
//       `;
//   return queryHasuraGQL(operationsDoc, "MyQuery", {});
// }

// export async function startFetchMyQuery() {
//   const { errors, data } = await fetchMyQuery();

//   if (errors) {
//     // handle those errors like a pro
//     console.error(errors);
//   }

//   // do something great with this precious data
//   console.log(data);
// }

// startFetchMyQuery();
