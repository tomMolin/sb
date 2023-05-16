## Theory Assignments
 * Question 1: what is missing
   * define a ci strategy to ensure quality is still there
   * define a git process : to handle properly release / hotfix
   * define a full deployment strategy to be able to deal with migrations and code/data rollback and less service disruption
     * it's missed a bundled version which remove all unnecessary files migrations / seeders / package.json / tests
   * Front end part is still in development mode : we need to turn it into production mode
   * move to typescript to reduce typing errors
   * add data validation
   * security :
     * db is not protected : everyone has access to it
     * no api authorization is required to access and push data in our database
     * libs are outdated : a npm audit `87 vulnerabilities (12 low, 23 moderate, 36 high, 16 critical)`
   * we can use a log transport to send log into a monitoring dashboard
   * code is not splitting by behaviour : all io operations are mixed in the same : a batch populate can flood our server and block write ops
   * where is the monitoring Sentry / datadog / grafana...

* Question 2:
  If it's an everyday task : we need to call it with a job scheduler that can generate job report.
  My ideal way for batch is to have a dedicated worker (separated from front end node/pods) that have its own db connection and that can do batch process directly and asynchronously
  Next we can use AWS S3 events to notify us when there is new files and to trigger our job that will populate the db. Our script can use a dedicated lib with an authentication to fetch files (or node fetch to get file content)

* Question 3:
  - Actually it's not necessary to generate such s3 files with a lot of unused attributes. Both files have attributes for the other format (ios/android).
  - Depending on our queries we can handle properly indexes/constraint to reduce our requests latency