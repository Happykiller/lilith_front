import { Trans } from "react-i18next";
import { useQuery } from "@apollo/client";

import "@component/footer.scss";
import { GQL } from "@src/common/gql";

export const Footer = () => {
  const { loading, error, data } = useQuery(GQL.QRY_SYSTEMINFO);

  const backVersion = loading
    ? "Loading..."
    : error
    ? `Error! ${error.message}`
    : data?.systemInfo?.version ?? "Nothing";

  return (
    <div className="footer">
      Lilith
      &nbsp;- <a href="mailto:fabrice.rosito@gmail.com">Email</a>
      &nbsp;- <Trans>version.front</Trans> {process.env.VERSION ?? "N/A"}
      &nbsp;- <Trans>version.back</Trans> {backVersion}
      &nbsp;- <a href="https://github.com/Happykiller/lilith_front/issues" target="_blank" rel="noopener noreferrer">
        <Trans>footer.issues</Trans>
      </a>
      &nbsp;- <a href="https://github.com/users/Happykiller/projects/1/views/1" target="_blank" rel="noopener noreferrer">
        <Trans>footer.roadmap</Trans>
      </a>
    </div>
  );
};
