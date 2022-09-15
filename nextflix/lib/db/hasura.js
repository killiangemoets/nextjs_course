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

  return response?.data?.users?.length === 0;
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

  return response.data.insert_users.returning[0].createNewUserMutation;
}

// Find a video for a specific user
export async function findVideoIdByUser(token, userId, videoId) {
  const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      userId,
      videoId,
    },
    token
  );

  // console.log({ response: response.data.stats });

  // return response?.data?.stats?.length > 0;
  return response?.data?.stats;
}

// Update stats for specific user and a specific video
export async function updateStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(
    _set: {watched: $watched, favourited: $favourited}, 
    where: {
      userId: {_eq: $userId}, 
      videoId: {_eq: $videoId}
    }) {
    returning {
      favourited,
      userId,
      watched,
      videoId
    }
  }
}
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      userId,
      watched,
      videoId,
    },
    token
  );

  return response;
}

// Insert stats for specific user and a specific video
export async function insertStats(
  token,
  { favourited, userId, watched, videoId }
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: 
    String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(object: {
        favourited: $favourited, 
        userId: $userId,
        watched: $watched,
        videoId: $videoId
      }) {
          favourited,
          userId,
          watched,
          videoId
        }
    }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "insertStats",
    {
      favourited,
      userId,
      watched,
      videoId,
    },
    token
  );

  return response;
}
