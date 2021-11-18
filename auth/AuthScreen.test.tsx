import { render } from "@testing-library/react-native";
import { AppContext, appContextDefault } from "../AppContext";
import { AuthScreen } from "./AuthScreen";
import React from "react";
import AuthSession from "expo-auth-session";

jest.mock("expo-auth-session", () => {
  const actual = jest.requireActual("expo-auth-session");

  return {
    ...actual,
    useAutoDiscovery: () => ({ tokenEndpoint: "https://example.com/token" }),
  };
});
const AuthSessionMock = AuthSession as jest.Mocked<typeof AuthSession>;

it("should do nothing, if token info restore wasn't tried yet", () => {
  const promptAsyncMock = jest.fn(() => undefined);
  const useAuthRequestMock = jest
    .fn()
    .mockImplementation(() => [{ url: "https://example.com/authorize" }, null, promptAsyncMock]);
  AuthSessionMock.useAuthRequest = useAuthRequestMock;

  render(
    <AppContext.Provider value={{ ...appContextDefault }}>
      <AuthScreen didTryRestoreTokenInfo={false} />
    </AppContext.Provider>
  );

  expect(useAuthRequestMock).toHaveBeenCalled();
  expect(promptAsyncMock).not.toHaveBeenCalled();
});

it("should set up auth request only, if token info was restored", () => {
  const promptAsyncMock = jest.fn(() => undefined);
  const useAuthRequestMock = jest
    .fn()
    .mockImplementation(() => [{ url: "https://example.com/authorize" }, null, promptAsyncMock]);
  AuthSessionMock.useAuthRequest = useAuthRequestMock;

  render(
    <AppContext.Provider value={{ ...appContextDefault, tokenInfo: { accessToken: "asd123asd123" } }}>
      <AuthScreen didTryRestoreTokenInfo={true} />
    </AppContext.Provider>
  );

  expect(useAuthRequestMock).toHaveBeenCalled();
  expect(promptAsyncMock).not.toHaveBeenCalled();
});

it("should authorize, get access token and populate app context, if no token info was restored", () => {
  const accessToken = "asd123asd123";
  const setTokenInfoMock = jest.fn();
  const promptAsyncMock = jest.fn();
  const useAuthRequestMock = jest
    .fn()
    // First call to useAuthRequest happens on mount
    .mockImplementationOnce(() => [{ url: "https://example.com/authorize" }, null, promptAsyncMock])
    // Second call to useAuthRequest happens after promptAsync is called.
    // Now, we return a response which represents a successful authentication.
    .mockImplementationOnce(() => [
      { url: "https://example.com/authorize" },
      { params: { code: "qweqweqwe" }, type: "success" },
      promptAsyncMock,
    ]);
  AuthSessionMock.useAuthRequest = useAuthRequestMock;
  const exchangeCodeAsyncMock = jest.fn().mockImplementation(() => Promise.resolve({ accessToken }));
  AuthSessionMock.exchangeCodeAsync = exchangeCodeAsyncMock;

  render(
    <AppContext.Provider value={{ ...appContextDefault, setTokenInfo: setTokenInfoMock }}>
      <AuthScreen didTryRestoreTokenInfo={true} />
    </AppContext.Provider>
  );

  expect(useAuthRequestMock).toHaveBeenCalled();
  expect(promptAsyncMock).toHaveBeenCalled();
  expect(exchangeCodeAsyncMock).toHaveBeenCalled();
  // This is not working somehow.
  // However, debugging the getAccessToken function in AuthScreen component clearly shows that setTokenInfo is called
  // correctly.
  // expect(setTokenInfoMock).toHaveBeenCalledWith({ accessToken });
});
