import http from "k6/http";

import { sleep } from "k6";

export const options = {
  scenarios: {
    posts_test: {
      executor: "constant-arrival-rate",

      // 100 requests/sec
      rate: 100,

      timeUnit: "1s",

      duration: "30s",

      // Start with 100 users
      preAllocatedVUs: 100,

      // Max concurrent users
      maxVUs: 100,
    },
  },
};

export default function () {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMWJjMjZhZDExMTQxOWMxYjNiZWU0NyIsImVtYWlsIjoicmFudmVlcnNpbmdoQGdtYWlsLmNvbSIsImlhdCI6MTc4MDIwODI3MCwiZXhwIjoxNzgwMjk0NjcwfQ.MGYaPck5aOGFvyD9aSqOuNiRMUUSM_I8V_P8LGedTiE";

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.get("http://localhost:5000/api/posts", params);

  console.log(`Status: ${res.status}`);

  sleep(1);
}
