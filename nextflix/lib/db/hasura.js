export async function queryHasuraGQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      // "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

// Check is a user exists
export async function isNewUser(token, issuer) {
  // The ! means that it's required
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      issuer
      id
      publicAddress
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  // console.log(response.data.users);

  return response?.data?.users.length === 0;
}

// Create a new user
export async function createNewUser(token, metadata) {
  // The ! means that it's required
  const operationsDoc = `
  mutation createNewUser( $issuer:String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      affected_rows
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  // console.log(response);

  return response.data.insert_users.returning[0].createNewUserMutation;
}

//////////////////// DON'T NEED ANYMORE /////////////////////
// const operationsDoc = `
//   query MyQuery {
//     users(where: {issuer: {_eq: "did:ethr:0x277EEb9780012626245BBc7E3d625067397C8CF5"}}) {
//       email
//       issuer
//       id
//       publicAddress
//     }
//   }
// `;

// function fetchMyQuery() {
//   return queryHasuraGQL(
//     operationsDoc,
//     "MyQuery",
//     {},
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweDI3N0VFYjk3ODAwMTI2MjYyNDVCQmM3RTNkNjI1MDY3Mzk3QzhDRjUiLCJwdWJsaWNBZGRyZXNzIjoiMHgyNzdFRWI5NzgwMDEyNjI2MjQ1QkJjN0UzZDYyNTA2NzM5N0M4Q0Y1IiwiZW1haWwiOiJraWxnZW1AbGl2ZS5mciIsIm9hdXRoUHJvdmlkZXIiOm51bGwsInBob25lTnVtYmVyIjpudWxsLCJpYXQiOjE2NjMwMDI5NDksImV4cCI6MTY2MzYwNzc0OSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiLCJhZG1pbiJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtdXNlci1pZCI6ImRpZDpldGhyOjB4Mjc3RUViOTc4MDAxMjYyNjI0NUJCYzdFM2Q2MjUwNjczOTdDOENGNSJ9fQ.h68TF8T37GTb4fqiSZKCLA7H6aku91Wx6rKil8Wgni4"
//   );
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
