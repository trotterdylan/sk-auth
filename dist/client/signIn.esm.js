async function signIn(provider, data, config) {
  if (data) {
    const path2 = `/api/auth/callback/${provider}`;
    const res = await fetch(path2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
  let redirectUrl;
  if (config?.redirectUrl) {
    redirectUrl = config.redirectUrl;
  }
  const queryData = {
    redirect: redirectUrl ?? "/"
  };
  const query = new URLSearchParams(queryData);
  const path = `/api/auth/login/${provider}?${query}`;
  return path;
}

export { signIn };
//# sourceMappingURL=signIn.esm.js.map
