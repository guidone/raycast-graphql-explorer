import { Action, ActionPanel, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { headersToText, isValidHttpUrl, parseHeadersText } from "../lib/request";
import { saveEnvironment } from "../lib/store";
import { Shortcuts } from "../lib/shortcuts";
import { GraphQLEnvironment } from "../lib/types";
import { testConnection } from "../lib/connection";

interface Values {
  name: string;
  url: string;
  headers: string;
}

interface Props {
  environment?: GraphQLEnvironment;
  /** Pre-filled values, used when duplicating */
  draft?: Partial<GraphQLEnvironment>;
  onSaved?: (environment: GraphQLEnvironment) => void;
}

export function EnvironmentForm({ environment, draft, onSaved }: Props) {
  const { pop } = useNavigation();
  const source = environment ?? draft;

  const { handleSubmit, itemProps, values } = useForm<Values>({
    initialValues: {
      name: source?.name ?? "",
      url: source?.url ?? "",
      headers: source?.headers ? headersToText(source.headers) : "",
    },
    validation: {
      name: FormValidation.Required,
      url: (value) => {
        if (!value?.trim()) return "Required";
        if (!isValidHttpUrl(value.trim())) return "Enter an http(s) URL";
      },
      headers: (value) => parseHeadersText(value ?? "").error,
    },
    async onSubmit(values) {
      const saved = await saveEnvironment(
        { name: values.name.trim(), url: values.url.trim(), headers: parseHeadersText(values.headers).headers },
        environment?.id,
      );
      await showToast({
        style: Toast.Style.Success,
        title: environment ? "Environment updated" : "Environment created",
      });
      onSaved?.(saved);
      pop();
    },
  });

  async function handleTest() {
    const url = values.url.trim();
    const parsed = parseHeadersText(values.headers);
    if (!isValidHttpUrl(url) || parsed.error) {
      await showToast({ style: Toast.Style.Failure, title: "Fix the URL and headers first" });
      return;
    }
    await testConnection({ url, headers: parsed.headers });
  }

  return (
    <Form
      navigationTitle={environment ? `Edit ${environment.name}` : "New Environment"}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Environment" icon={Icon.Check} onSubmit={handleSubmit} />
          <Action
            title="Test Connection"
            icon={Icon.Network}
            shortcut={Shortcuts.TestConnection}
            onAction={handleTest}
          />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" placeholder="Production" autoFocus {...itemProps.name} />
      <Form.TextField title="Endpoint URL" placeholder="https://api.example.com/graphql" {...itemProps.url} />
      <Form.TextArea
        title="Headers"
        placeholder={"Authorization: Bearer <token>\nX-Tenant-Id: acme"}
        info={
          'One header per line in the form "Name: value". Lines starting with # are ignored. ' +
          "Content-Type: application/json is added automatically."
        }
        {...itemProps.headers}
      />
      <Form.Description text="Headers are kept in this extension's local Raycast storage and sent with every request to this endpoint." />
    </Form>
  );
}
