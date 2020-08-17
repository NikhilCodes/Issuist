const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserToProjectsIdSchema = new Schema({
  _id: {type: String},
  sessionToken: {type: String},
  projects: {
    type: [{
      _id: {type: String, required: true},
    }]
  }
}, {collection: 'User->Projects'})

const ProjectSchema = new Schema({
  _id: {type: String},
  projectName: {type: String},
  projectCode: {type: String},
  startDate: {type: String},
  endDate: {type: String},
  issues: [{
    _id: {type: String},
  }],
}, {collection: 'ProjectCollection'})

const IssueSchema = new Schema({
  title: {type: String},
  issueNumber: {type: Number},
  isOpen: {type: Boolean},
  createdOn: {type: Date},
  authorId: {type: String},
  comments: [{
    commenterId: {type: String},
    comment: {type: String},
    isEdited: {type: Boolean},
    commentedOn: {type: Date}
  }]
}, {collection: 'IssuesCollection'})

const UserToProjectsIdModel = mongoose.model('UserToProjectsIdModel', UserToProjectsIdSchema)
const ProjectModel = mongoose.model('ProjectModel', ProjectSchema)
const IssueModel = mongoose.model('IssueModel', IssueSchema)

module.exports = {
  UserToProjectsIdModel,
  ProjectModel,
  IssueModel,
}