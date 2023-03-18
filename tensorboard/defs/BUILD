# load("//tensorboard/defs:protos.bzl", "tb_proto_library")
# load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@npm//@bazel/concatjs:index.bzl", "ts_library")

package(default_visibility = ["//tensorboard:internal"])

licenses(["notice"])

ts_library(
    name = "strict_types",
    srcs = ["strict_type_check.d.ts"],
)
