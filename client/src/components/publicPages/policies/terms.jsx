import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container">
      <div className=" mt-5 mb-2 text-gray-400">
        <Link to="/" className="text-gray-400">
          <div className="">
            <i className="bi bi-arrow-left me-2"></i>
            Home
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-y-4 mt-4">
        <h1>Terms of Service for Transverse AI LLC Website</h1>

        <h2>1. Acceptance of Terms</h2>
        <p>
          When you access the Transverse AI LLC Website, available at
          <a href="https://transverse-ai.com">https://transverse-ai.com</a>, you
          enter into an agreement to adhere to these Terms of Service. You also
          agree to comply with relevant local laws. Accessing this site is
          prohibited if you do not agree with these terms. The content on this
          Website is safeguarded by copyright and trademark laws.
        </p>

        <h2>2. Grant of Use License</h2>
        <p>
          Transverse AI LLC grants you a temporary, non-transferable license to
          download a single copy of the materials on this Website exclusively
          for personal, non-commercial use. This license does not entail a
          transfer of ownership, and under this license, you are not permitted
          to:
          <ul>
            <li>Modify or replicate the materials;</li>
            <li>
              Use the materials for any commercial purposes or public display;
            </li>
            <li>Reverse engineer any software found on the Website;</li>
            <li>
              Remove any copyright or proprietary notations from the materials;
            </li>
            <li>
              Transfer the materials to another individual or replicate the
              materials on another server.
            </li>
          </ul>
          Violation of these restrictions may result in Transverse AI LLC
          terminating this license. Upon termination, you must destroy any
          downloaded materials in your possession, whether in printed or
          electronic format.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          All materials on Transverse AI LLC's Website are provided "as is."
          Transverse AI LLC disclaims all warranties, explicit or implicit, and
          denies any other warranties. Additionally, Transverse AI LLC does not
          warrant or make any representations regarding the accuracy, likely
          results, or reliability of the use of the materials on its Website or
          otherwise.
        </p>

        <h2>4. Limitation of Liability</h2>
        <p>
          Transverse AI LLC or its suppliers will not be liable for any damages
          arising from the use or inability to use the materials on Transverse
          AI LLC's Website. This limitation applies even if Transverse AI LLC or
          an authorized representative has been informed of the possibility of
          such damages. Some jurisdictions do not allow limitations on implied
          warranties or liability for incidental damages, so these limitations
          may not apply to you.
        </p>

        <h2>5. Revisions and Errors</h2>
        <p>
          The materials appearing on Transverse AI LLC's Website may contain
          technical, typographical, or photographic errors. Transverse AI LLC
          does not guarantee that any materials on the Website are accurate,
          complete, or current. Transverse AI LLC may change the materials
          contained on its Website at any time without notice and does not
          commit to updating the materials.
        </p>

        <h2>6. External Links</h2>
        <p>
          Transverse AI LLC has not reviewed all sites linked to its Website and
          is not responsible for the contents of any linked site. The inclusion
          of any link does not imply endorsement by Transverse AI LLC. Use of
          any linked website is at the user's own risk.
        </p>

        <h2>7. Modifications to Terms of Use</h2>
        <p>
          Transverse AI LLC reserves the right to revise these Terms of Use for
          its Website at any time without notice. By using this Website, you
          agree to be bound by the then-current version of these Terms of
          Service.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          Any claim relating to Transverse AI LLC's Website shall be governed by
          the laws of the Country, disregarding its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
