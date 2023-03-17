#!/bin/bash

# ./api/proto/build.sh api/proto/v1 internal/adapters/rpc/pb/v1
# build.sh lang protoDir outDir importRoot
# proto dir files must start with [name] of the proto folder -> [name]/vX or [name]
# packageName by suffice of out dir [name] or [name]/vX
# importRoot is the root of the repo files
# go_package in proto files must be {protoDir}/{dirName}pb for example: api/proto/v1/commonpb

# example:
# ./api/proto/build.sh go api/proto/v1 internal/adapters/rpc/pb/v1 gitlab.espadev.ir/espad/back/account
# ./api/pb/build.sh go api/pb/v2 internal/adapters/rpc/pb gitlab.espadev.ir/espad/back/account

# deps
#
# protoc
# go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
# go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
#
# grpc-web
# https://github.com/grpc/grpc-web/releases
# brew install protoc-gen-grpc-web

awkReplace() {
    awk "${1}" "${2}" > "${2}.tmp"
    mv -f "${2}.tmp" "${2}"
}

# inputs:
#   outDir
#   prefixFilename
initOut() {
    #[ -d ${outDir} ] && rm -rf ${outDir}/${prefixFilename}_*.pb.go
    [ -d ${outDir} ] && rm -rf ${outDir}
    mkdir -p ${outDir}
}

# inputs:
#   protoDir
# outputs:
#   protoFiles
genProtoFiles() {
    SAVEIFS=$IFS
    IFS=$(echo -en "\n\b")
    local files=$(find ${protoDir} -type f -name "*.proto")
    # echo "files: ${files}"
    protoFiles=""
    for file in ${files}
    do
        echo "Proto: ${file}"
        protoFiles+=" ${file}"
    done
    IFS=$SAVEIFS
}

# inputs:
#   protoFiles
#   outDir
#   packageName
buildGoProtoc() {
    local goOpt=""
    local cmd=(protoc \
        --proto_path="${protoDir}" \
        --go_opt=paths=source_relative \
        --go-grpc_opt=paths=source_relative \
        --go_out="${outDir}" \
        --go-grpc_out="${outDir}" \
        ${goOpt} \
        ${protoFiles})
    echo ${cmd[@]}
    "${cmd[@]}"
}

# inputs:
#   protoFiles
#   outDir
#   packageName
buildTSProtoc() {
    local cmd=(protoc \
        --proto_path="${protoDir}" \
        --js_out=import_style=commonjs,binary:"${outDir}" \
        --grpc-web_out=import_style=typescript,mode=grpcweb:"${outDir}"
        ${protoFiles})

    echo ${cmd[@]}
    "${cmd[@]}"
}

# inputs:
#   outDir
patchGoPackageName() {
    local dir="${outDir}"
    echo "patchGoPackageName: ${dir}"

    local packages=$(find ${dir} -type d | sort -nr)
    for package in ${packages}
    do
        if [ ${package} == ${dir} ]; then
            continue
        fi

        mv ${package} ${package}pb

        local packageName=`basename ${package}`pb

        local files=$(find ${package}pb -maxdepth 1 -type f -name "*.pb.go")
        for file in ${files}
        do
            awkReplace "NR==1,/package/{sub(/package.*/, \"package ${packageName}\")} 1" "${file}"
        done
    done
}

patchGoImportPath() {
    local packages=$(find ${outDir} -type d)
    for package in ${packages}
    do
        if [ ${package} == ${outDir} ]; then
            continue
        fi

        local files=$(find ${package} -type f -name "*.pb.go")
        for file in ${files}
        do
            awkReplace "{sub(\"${protoDir}\", \"${importRoot}/${outDir}\")} 1" "${file}"
        done
    done
}


# input -> ${outDir}
# output -> ${packageName}
# output -> ${packageName2} packageName2 without version
# output (deleted) -> ${outDir2} outDir without packageName
genPackageName() {
    local dirName2=`dirname "$outDir"`
    local dirName1=`basename "$outDir"`

    # suffix is /vXX
    if [[ $dirName2 != "" && $dirName1 =~ ^v[0-9]+$ ]]
    then
        packageName2=`basename "${dirName2}"`
        packageName=${packageName2}/${dirName1}
        #outDir2=`dirname ${dirName2}`
    else
        packageName=${dirName1}
        packageName2=${packageName}
        #outDir2=`dirname ${outDir}`
    fi
}
# input -> ${protoDir}
# output -> ${prefixFilename} proto files prefix by folder name
genPrefixFileName() {
    local dirName2=`dirname "$protoDir"`
    local dirName1=`basename "$protoDir"`

    # suffix is /vXX
    if [[ $dirName2 != "" && $dirName1 =~ ^v[0-9]+$ ]]
    then
        prefixFilename=`basename "${dirName2}"`
    else
        prefixFilename=${dirName1}
    fi
}

lang="${1}"
protoDir="${2}"
outDir="${3}"
importRoot="${4}"

initOut
genProtoFiles

if [ ${lang} == "ts" ]
then
    buildTSProtoc
else
    genPackageName
    genPrefixFileName

    buildGoProtoc

    patchGoPackageName
    patchGoImportPath
fi
