import { useContext } from "react";
import { useRendersCount, useUpdate } from "react-use";
import { Button } from "../../../ye-ui/components/atoms/forms/Button";
import { getStoryName } from "../../utils/storybook";
import * as ACTION_TYPES from "./authActions";
import SampleProviderComponent, { AuthContext } from "./SampleProvider";

const metadata = {
  title: getStoryName(__dirname),
  component: SampleProviderComponent,
};

export default metadata;

function getSampleAction(type) {
  const action = { type };
  switch (type) {
    case ACTION_TYPES.LOGIN_SUCCESS:
    case ACTION_TYPES.SIGNUP_SUCCESS:
      action.payload = {
        accessToken: "access-token",
        userData: { username: "username", name: "Shyam" },
      };
      break;
    default:
      break;
  }
  return action;
}

function RenderContainer({ children, style, hasUpdateButton, ...props }) {
  const update = useUpdate();
  const rendersCount = useRendersCount();
  return (
    <div
      style={{
        border: "1px solid var(--color-black-10)",
        padding: "var(--spacing-em-large)",
        ...style,
      }}
      {...props}
    >
      <p>
        Renders: {rendersCount}
        {hasUpdateButton ? (
          <>
            &nbsp;&nbsp;
            <Button size="small" label="Update State" onClick={update} />
          </>
        ) : null}
      </p>
      {children}
    </div>
  );
}

function ActionsComponent({ ...props }) {
  const { dispatch } = useContext(AuthContext);
  return (
    <RenderContainer hasUpdateButton {...props}>
      <h2>Child with Provider Actions</h2>
      {Object.entries(ACTION_TYPES).map(([key, value]) => (
        <Button
          key={key}
          label={key}
          onClick={() => dispatch(getSampleAction(value))}
          style={{ margin: ".5em" }}
        />
      ))}
    </RenderContainer>
  );
}

function StateComponent(props) {
  const state = useContext(AuthContext);
  return (
    <RenderContainer {...props}>
      <h2>Child with Provider States</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </RenderContainer>
  );
}

const Template = ({ ...args }) => (
  <RenderContainer hasUpdateButton>
    <h2>Parent Component</h2>
    <SampleProviderComponent {...args}>
      <ActionsComponent />
      <StateComponent />
      <RenderContainer>
        <h2>Child Component not using Provider</h2>
      </RenderContainer>
    </SampleProviderComponent>
  </RenderContainer>
);

export const SampleProvider = Template.bind({});
SampleProvider.args = {};
