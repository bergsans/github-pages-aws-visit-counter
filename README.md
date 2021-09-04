# GitHub Pages AWS Visit Counter

GitHub Pages don't save page visits. Therefore we cannot use a server-side approach. This is a simplistic front-end solution using AWS serverless lambda, a scheduler and DynamoDB.

## Setup
```
npm install
sls deploy // after changing the GITHUB_PAGES_URL variable in
           // in src/function/new-visit/handler.ts
```

To use it on a GitHub page simply do fetch GET-request to `https://your-aws-generated-url/dev/api/new-visit?url=${window.location.url}` where `window.location.url`'s must start with the same url as stated in the `GITHUB_PAGES_URL` variable.

## Add visit
```
$ curl https://your-aws-generated-url/dev/api/new-visit?url=https://bergsans.github.io/2
```

## View count
```
curl {GENERATED_AWS_URL}/dev/api/get-visits
```

Output will look like:
```
$ curl https://your-aws-generated-url/dev/api/get-visit-count

THIS MONTH
==========
https://bergsans.github.io/5    --      2
https://bergsans.github.io/3    --      1


ALL TIME
==========
https://bergsans.github.io/2    --      2
https://bergsans.github.io/1    --      3
https://bergsans.github.io/5    --      1


TOTAL
==========
11
```
