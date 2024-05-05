function generateStyleSheet(scaleFactor) {
  const styles = `
            .scale-text {
              font-size: ${scaleFactor * 1.125}rem !important;
              line-height: ${scaleFactor * 1.7777778} !important;
            }
        
            .scale-text p {
              margin-top: ${scaleFactor}em !important;
              margin-bottom: ${scaleFactor}em !important;
            }
        
            .scale-text [class~="lead"] {
              font-size: ${scaleFactor * 1.2222222}em !important;
              line-height: ${scaleFactor * 1.4545455} !important;
              margin-top: ${scaleFactor * 1.0909091}em !important;
              margin-bottom: ${scaleFactor * 1.0909091}em !important;
            }
        
            .scale-text blockquote {
              margin-top: ${scaleFactor * 1.6666667}em !important;
              margin-bottom: ${scaleFactor * 1.6666667}em !important;
              padding-left: ${scaleFactor * 1.0666667}em !important;
            }
        
            .scale-text h1 {
              font-size: ${scaleFactor * 2.66}em !important;
              margin-top: ${scaleFactor * 0}em !important;
              margin-bottom: ${0.8888889}em !important;
              line-height: ${scaleFactor * 1.1111111} !important;
            }
        
            .scale-text h2 {
              font-size: ${scaleFactor * 1.6666667}em !important;
              margin-top: ${Math.log(scaleFactor)}em !important;
              margin-bottom: ${Math.log(scaleFactor)}em !important;
              line-height: ${scaleFactor * 1.3333333} !important;
            }
        
            .scale-text h3 {
              font-size: ${scaleFactor}em !important;
              margin-top: ${Math.log(scaleFactor)}em !important;
              margin-bottom: ${Math.log(scaleFactor) * 0.6666667}em !important;
              line-height: ${scaleFactor * 1.5} !important;
            }
        
            .scale-text h4 {
              margin-top: ${scaleFactor * 1.7777778}em !important;
              margin-bottom: ${scaleFactor * 0.4444444}em !important;
              line-height: ${scaleFactor * 1.5555556} !important;
            }
        
            .scale-text img {
              margin-top: ${scaleFactor * 1.7777778}em !important;
              margin-bottom: ${scaleFactor * 1.7777778}em !important;
            }
        
            .scale-text video {
              margin-top: ${scaleFactor * 1.7777778}em !important;
              margin-bottom: ${scaleFactor * 1.7777778}em !important;
            }
        
            .scale-text figure {
              margin-top: ${scaleFactor * 1.7777778}em !important;
              margin-bottom: ${scaleFactor * 1.7777778}em !important;
            }
        
            .scale-text figure > * {
              margin-top: ${scaleFactor * 0}em !important;
              margin-bottom: ${scaleFactor * 0}em !important;
            }
        
            .scale-text h2 code {
              font-size: ${scaleFactor * 0.875}em !important;
            }
        
            .scale-text h3 code {
              font-size: ${scaleFactor * 0.9}em !important;
            }
        
            .scale-text ol {
              margin-top: ${scaleFactor}em !important;
              margin-bottom: ${scaleFactor}em !important;
              padding-left: ${scaleFactor * 1.6}em !important;
            }
        
            .scale-text ul {
              margin-top: ${scaleFactor}em !important;
              margin-bottom: ${scaleFactor}em !important;
              padding-left: ${scaleFactor * 1.6}em !important;
            }
        
            .scale-text li {
              margin-top: ${scaleFactor * 0.6666667}em !important;
              margin-bottom: ${scaleFactor * 0.6666667}em !important;
            }
        
            .scale-text > ul > li p {
              margin-top: ${scaleFactor * 0.8888889}em !important;
              margin-bottom: ${scaleFactor * 0.8888889}em !important;
            }
        
            .scale-text > ul > li > *:first-child {
              margin-top: ${scaleFactor * 1.3333333}em !important;
            }
        
            .scale-text > ul > li > *:last-child {
              margin-bottom: ${scaleFactor * 1.3333333}em !important;
            }
        
            .scale-text > ol > li > *:first-child {
              margin-top: ${scaleFactor * 1.3333333}em !important;
            }
        
            .scale-text > ol > li > *:last-child {
              margin-bottom: ${scaleFactor * 1.3333333}em !important;
            }
        
            .scale-text ul ul, .scale-text ul ol, .scale-text ol ul, .scale-text ol ol {
              margin-top: ${scaleFactor * 0.8888889}em !important;
              margin-bottom: ${scaleFactor * 0.8888889}em !important;
            }
        
            .scale-text hr {
              margin-top: ${scaleFactor * 3.1111111}em !important;
              margin-bottom: ${scaleFactor * 3.1111111}em !important;
            }
        
            .scale-text hr + * {
              margin-top: ${scaleFactor * 0}em !important;
            }
        
            .scale-text h2 + * {
              margin-top: ${scaleFactor * 0}em !important;
            }
        
            .scale-text h3 + * {
              margin-top: ${scaleFactor * 0}em !important;
            }
        
            .scale-text h4 + * {
              margin-top: ${scaleFactor * 0}em !important;
            }
        
            .scale-text table {
              font-size: ${scaleFactor * 0.8888889}em !important;
              line-height: ${scaleFactor * 1.5} !important;
            }
        
            .scale-text thead th {
              padding-right: ${scaleFactor * 0.6666667}em !important;
              padding-bottom: ${scaleFactor * 0.8888889}em !important;
              padding-left: ${scaleFactor * 0.6666667}em !important;
            }
        
            .scale-text thead th:first-child {
              padding-left: ${scaleFactor * 0}em !important;
            }
        
            .scale-text thead th:last-child {
              padding-right: ${scaleFactor * 0}em !important;
            }
        
            .scale-text tbody td {
              padding-top: ${scaleFactor * 0.8888889}em !important;
              padding-right: ${scaleFactor * 0.6666667}em !important;
              padding-bottom: ${scaleFactor * 0.8888889}em !important;
              padding-left: ${scaleFactor * 0.6666667}em !important;
            }
        
            .scale-text tbody td:first-child {
              padding-left: ${scaleFactor * 0}em !important;
            }
        
            .scale-text tbody td:last-child {
              padding-right: ${scaleFactor * 0}em !important;
            }
        
            .scale-text > :first-child {
              margin-top: ${scaleFactor * 0}em !important;
            }
        
            .scale-text > :last-child {
              margin-bottom: ${scaleFactor * 0}em !important;
            }
          `;

  if (scaleFactor) {
    return styles;
  }
}

export default generateStyleSheet;
