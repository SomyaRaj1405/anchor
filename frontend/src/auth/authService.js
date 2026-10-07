const DEMO_ACCOUNTS = {
  "candidate@anchor.app": {
    id: "cand-001",
    name: "Maya Chen",
    role: "candidate",
    password: "password123",
    token: "candidate-demo-token",
  },
  "employer@anchor.app": {
    id: "emp-001",
    name: "Daniel Reed",
    role: "employer",
    password: "password123",
    token: "employer-demo-token",
  },
  "reviewer@anchor.app": {
    id: "rev-001",
    name: "Priya Shah",
    role: "reviewer",
    password: "password123",
    token: "reviewer-demo-token",
  },
};

export async function login({ email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const account = DEMO_ACCOUNTS[normalizedEmail];

  if (!account || account.password !== String(password || "")) {
    throw new Error("We couldn’t find an account with those details.");
  }

  return {
    user: {
      id: account.id,
      name: account.name,
      email: normalizedEmail,
      role: account.role,
    },
    token: account.token,
  };
}

export const demoAccounts = Object.entries(DEMO_ACCOUNTS).map(([email, account]) => ({
  email,
  name: account.name,
  role: account.role,
  password: account.password,
}));
