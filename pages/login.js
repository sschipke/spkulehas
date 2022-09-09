import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useRouter } from "next/router";

import { showLoginModal } from "../actions";

const LoginPage = ({ showLoginModal }) => {
  const router = useRouter();

  useEffect(() => {
    showLoginModal();
    router.push("/");
  });
  return null;
};

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showLoginModal,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(LoginPage);
