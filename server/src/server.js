const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const protoFile = require('path').resolve(__dirname, '../../proto/bookstore.proto')
const Database = new (require('./db'))()

const { authorImpl, bookstoreImpl } = require('./handlers')

const protoObject = protoLoader.loadSync(protoFile)
const protoDefinition = grpc.loadPackageDefinition(protoObject)

const server = new grpc.Server()

server.addService(protoDefinition.Bookstore.service, bookstoreImpl(Database))
server.addService(protoDefinition.Authors.service, authorImpl(Database))

server.bindAsync(
    `0.0.0.0:${process.env.PORT || 50051}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if(err) throw err
        server.start()
        console.log(`Server started on port ${port}`)
    })