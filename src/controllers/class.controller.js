import crypto from "crypto";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/apiError.js";
import { classSchema } from "../validators/class.validator.js";

class ClassController {
  // Admin's Class Management controllers
  createClass = asyncHandler(async (req, res) => {
    const { error } = classSchema.safeParse(req.body);
    if (error) {
      throw ApiError.badRequest(error.message);
    }

    const { name, description } = req.body;
    const userId = req.user;

    const code = crypto.randomBytes(3).toString("hex").toUpperCase();
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        code,
        admins: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res
      .status(201)
      .json(ApiResponse.success(newClass, "Class created successfully"));
  });


  updateClass = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    //validate request
    if(!code) {
      throw ApiError.badRequest("Invalid class code");
    }
    const { name, description } = req.body;

    if (!name || !description) {
      throw ApiError.badRequest("Name or description is required");
    }

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to update class");
    }

    const updatedClass = await prisma.class.update({
      where: {
        code,
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json(
      ApiResponse.success(updatedClass, "Class updated successfully")
    );
  });


  deleteClass = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    //validate request
    if (!code) {
      throw ApiError.badRequest("Invalid class code");
    }
    if (!userId) {
      throw ApiError.unauthorized("Login to delete class");
    }

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to delete class");
    }

    const deletedClass = await prisma.class.delete({
      where: {
        code,
      },
    });

    return res
      .status(200)
      .json(ApiResponse.success(deletedClass, "Class deleted successfully"));
  });


  getClassDetails = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
        participants: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      //return filtered class details
      const filteredClassDetails = {
        name: classDetails.name,
        description: classDetails.description,
        code: classDetails.code,
        admins: classDetails.admins,
      };
      return res
        .status(200)
        .json(ApiResponse.success(filteredClassDetails, "Class details found"));
    }

    return res
      .status(200)
      .json(ApiResponse.success(classDetails, "Full Class details found"));
  });


  getAllJoinRequests = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
        joinRequests: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to view requests");
    }

    return res
      .status(200)
      .json(ApiResponse.success(classDetails.joinRequests, "Requests found"));
  });


  acceptRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user;

    const request = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
      },
      include: {
        class: true,
      },
    });

    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    //get admin details of the class
    const classDetails = await prisma.class.findFirst({
      where: {
        id: request.classId,
      },
      include: {
        admins: true,
      },
    });

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to accept requests");
    }

    //check if request is pending
    if (request.status !== "pending") {
      throw ApiError.conflict("Request is already processed");
    }

    //approve request
    const acceptedRequest = await prisma.joinRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "accepted",
      },
    });

    //send notification to user
    const notification = await prisma.notification.create({
      data: {
        userId: request.userId,
        message: `Your request to join ${classDetails.name} has been accepted`,
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(acceptedRequest, "Request accepted successfully")
      );
  });


  rejectRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user;

    const request = await prisma.joinRequest.findFirst({
      where: {
        id: requestId,
      },
      include: {
        class: true,
      },
    });

    if (!request) {
      throw ApiError.notFound("Request not found");
    }

    //get admin details of the class
    const classDetails = await prisma.class.findFirst({
      where: {
        id: request.classId,
      },
      include: {
        admins: true,
      },
    });

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to approve requests");
    }

    console.log(request.status);
    //check: req status is pending
    if (request.status !== "pending") {
      throw ApiError.conflict("Request is already processed");
    }

    //approve request
    const rejectedRequest = await prisma.joinRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "rejected",
      },
    });

    //send notification to user
    const notification = await prisma.notification.create({
      data: {
        userId: request.userId,
        message: `Your request to join ${classDetails.name} has been rejected`,
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(rejectedRequest, "Request rejected successfully")
      );
  });


  removeParticipant = asyncHandler(async (req, res) => {
    const { participantId:id } = req.params;
    const userId = req.user;

    const participant = await prisma.participant.findFirst({
      where: {
        id,
      },
      include: {
        class: true,
      },
    });

    if (!participant) {
      throw ApiError.notFound("Participant not found");
    }

    //get admin details of the class
    const classDetails = await prisma.class.findFirst({
      where: {
        id: participant.classId,
      },
      include: {
        admins: true,
      },
    });

    //check if user is an admin of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);

    if (!isAdmin) {
      throw ApiError.forbidden("You are not authorized to remove participants");
    }

    //remove participant
    const removedParticipant = await prisma.participant.delete({
      where: {
        id,
      },
    });

    //send notification to user
    const notification = await prisma.notification.create({
      data: {
        userId: participant.userId,
        message: `You have been removed from ${classDetails.name} `,
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(
          removedParticipant,
          "Participant removed successfully"
        )
      );
  });




  // Participant's Class Management controllers
  requestToJoin = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;
    //validate request
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const classDetails = await prisma.class.findFirst({
      where: { code },
      include: {
        admins: true,
        participants: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }
    //check if user is already a member of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    const isMember = classDetails.participants.find(
      (participant) => participant.id === userId
    );

    if (isAdmin || isMember) {
      throw ApiError.conflict("You are already in this class");
    }

    // check if user has already requested to join the class
    const request = await prisma.joinRequest.findFirst({
      where: {
        classId: classDetails.id,
        userId,
      },
    });

    //check the all the cases where the user can't request to join the class
    if (request) {
      if (request.status === "pending") {
        throw ApiError.forbidden("Request to join class is already pending");
      } else if (request.status === "accepted") {
        throw ApiError.forbidden("You are already accepted in this class");
      } else if (request.status === "rejected") {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const coolDownEnds = new Date(request.updatedAt.getTime() + oneWeek);
        if (Date.now() < coolDownEnds.getTime()) {
          throw ApiError.forbidden(
            `You have been rejected from joining this class. You can request to join again after ${coolDownEnds.toDateString()}`
          );
        }
      } else if (request.status === "blocked") {
        throw ApiError.forbidden(
          "You have been blocked from joining this class"
        );
      }
    }

    //all ok at this point, proceed to request to join class
    const newRequest = await prisma.joinRequest.create({
      data: {
        userId,
        classId: classDetails.id,
      },
    });

    //send notification to class
    const notification = await prisma.notification.create({
      data: {
        classId: classDetails.id,
        message: `${user.name}(${user.username}) has requested to join the class`,
      },
    });

    return res
      .status(201)
      .json(
        ApiResponse.success(
          newRequest,
          "Request to join class sent successfully, waiting for approval"
        )
      );
  });

  joinClass = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    //validate request
    if (!code) {
      throw ApiError.badRequest("Invalid class code");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("Login to join class");
    }

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
        participants: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is already a member of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    const isMember = classDetails.participants.find(
      (participant) => participant.id === userId
    );

    if (isAdmin || isMember) {
      throw ApiError.conflict("You are already in this class");
    }

    // check: if join request is accept for this user
    const request = await prisma.joinRequest.findFirst({
      where: {
        classId: classDetails.id,
        userId,
      },
    });
    if (request.status !== "accepted") {
      throw ApiError.forbidden("You are not accepted in this class");
    }

    //all ok at this point, proceed to join class
    const response = await prisma.class.update({
      where: {
        code,
      },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(response, "You have successfully joined the class")
      );
  });

  leaveClass = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const userId = req.user;

    //validate request
    if (!code) {
      throw ApiError.badRequest("Invalid class code");
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw ApiError.unauthorized("Login to leave class");
    }

    const classDetails = await prisma.class.findFirst({
      where: {
        code,
      },
      include: {
        admins: true,
        participants: true,
      },
    });

    if (!classDetails) {
      throw ApiError.notFound("Class not found");
    }

    //check if user is a member of the class
    const isAdmin = classDetails.admins.find((admin) => admin.id === userId);
    const isMember = classDetails.participants.find(
      (participant) => participant.id === userId
    );

    if (!isAdmin || !isMember) {
      throw ApiError.conflict("You are not in this class");
    }

    //all ok at this point, proceed to leave class
    const response = await prisma.class.update({
      where: {
        code,
      },
      data: {
        participants: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  });
}

export default new ClassController();
