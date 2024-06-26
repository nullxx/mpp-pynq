import packageJSON from "../../package.json";
import I18n from "./i18n";

export default function Attribution() {
  return (
      <I18n
        k="credit"
        format={(t =>
          t
            .replace('<AUTHOR_URL>', packageJSON.author.url)
            .replace('<AUTHOR_NAME>', packageJSON.author.name
            ))}
        evalu
      />
  );
}
