# GraphQL Explorer

Save GraphQL queries against named environments and run them from Raycast.

## Commands

### Manage GraphQL Environments

An environment is a GraphQL endpoint plus the headers sent with every request. Headers go one per line as `Name: value`, for example `Authorization: Bearer <token>`. Lines starting with `#` are ignored.

- Create (⌘N), edit (↵), duplicate (⌘D) and delete (⌃X) environments.
- **Test Connection** (⌘⇧T) sends `{ __typename }` and reports the HTTP status and timing.
- **Clear Cached Schema** (⌘⇧L) drops the cached introspection result.

### Search GraphQL Queries

Each query has a name, an environment, a Font Awesome icon and color, and a GraphQL document. A document can contain several operations and fragments.

- **Run Query** (↵) sends the query to its environment. **Run in Environment…** (⌘⇧R) sends it to a different environment.
- Create (⌘N), edit (⌘E), duplicate (⌘D) and delete (⌃X) queries. You can filter the list by environment from the search bar.
- **Show Details** (⌘⇧D) shows the query with syntax highlighting, along with its operations and variables.
- In the query form, **Preview Query** (⌘⇧P) shows the query with syntax highlighting and **Format Query** (⌘⇧F) pretty-prints it.

On Windows, use Ctrl instead of ⌘.

## Running queries with variables

If the query declares variables, a form asks for them before running:

| Variable type | Input |
| --- | --- |
| `String`, `ID`, custom scalars | text field |
| `Int`, `Float` | text field, validated as a number |
| `Boolean!` | checkbox |
| `Boolean`, enums | dropdown (enums need the schema) |
| lists, input objects, `JSON` scalars | JSON editor (text area validated as you type, ⌘⇧F to format) |

The schema is loaded with introspection and cached for one hour. The extension uses it to:

- list enum values in dropdowns
- pre-fill each JSON editor with a template of the input object's required fields
- show the input object's available fields in the field's info tooltip

If introspection is disabled on the server, field types are inferred from the query instead. The last values you used are remembered for each query.

## Response

The response is shown as pretty-printed JSON, with the HTTP status, timing, size and GraphQL error count. From the response you can:

- copy the whole response or only its `data` field
- **Run Again** (⌘R)
- **Open in Editor** (⌘O)
- **Copy as Curl Command** (⌘⇧U)

## Notes

- Raycast form text areas cannot highlight syntax. Queries are highlighted in the list details, the query preview and the response view.
- Environments, queries and the last-used variables are kept in this extension's Raycast local storage.

## Credits

Icons: [Font Awesome Free](https://fontawesome.com) by Fonticons, Inc., licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
