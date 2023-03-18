load("//tensorboard/defs:defs.bzl", "tf_js_binary", "tf_ts_library")

package(default_visibility = ["//tensorboard:internal"])

licenses(["notice"])

tf_ts_library(
    name = "analytics",
    srcs = [
        "analytics.ts",
    ],
)

tf_ts_library(
    name = "security",
    srcs = [
        "security.ts",
    ],
    strict_checks = False,
    deps = [
        "@npm//@polymer/polymer",
    ],
)
