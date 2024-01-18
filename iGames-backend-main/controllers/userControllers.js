const userModel = require("../models/userModel");
const gameModel = require("../models/gameModel");
const ErrorResponse = require("../utils/errorResponse");

// Method: POST
// URL: /api/users/register
// Desc: Allows a user to create an account using their email id and password. Once registered, a JWT is issued and stored as a cookie in the browser.
async function register(req, res, next) {
    const { email } = req.body;
    try {
        // The email address needs to be unique to each user, hence we throw an error if the user is trying to create an account with an email that already exists in the database.
        const user = await userModel.findOne({ email });
        if (user) next(new ErrorResponse(`Email already exists`, 409));

        // Create the new user and save it on the database.
        const newUser = await userModel(req.body);
        await newUser.save();

        // Once the user has been saved to the database, we generate a JWT auth token that is unique to the user send it back to the client.
        const token = newUser.generateAuthToken();
        res.json({
            success: true,
            statusCode: 201,
            response: newUser,
            token: "Bearer " + token,
            message: "Your account has been successfully created",
        });
    } catch (error) {
        next(error);
    }
}

// Method: POST
// URL: /api/users/login
// Desc: Allows a user to sign in to an existing account using the registerd email id and password. Once logged in, a JWT is issued and stored as a cookie in the browser.
async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        // Try to find a user by their email.
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Invalid email or password", 401));
        }

        // Compare the password entered to the hashed password in the database
        const passwordsMatch = await user.isMatch(password);
        if (!passwordsMatch) {
            return next(new ErrorResponse("Invalid email or password", 401));
        }

        // Generate the auth token and send it back to the client.
        const token = user.generateAuthToken();
        res.json({
            success: true,
            statusCode: 200,
            response: user,
            token: "Bearer " + token,
            message: "Logged in successfully",
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/wishlist/add
// Desc: Adds a game to the user's wishlist if it isn't present in the wishlist.
async function addToWishlist(req, res, next) {
    const { gameId } = req.body;
    try {
        // Find the game by id and check if they exist in the database
        const game = await gameModel.findById(gameId);
        if (!game) {
            return next(new ErrorResponse(`Game with ID ${gameId} was not found.`, 404));
        }

        // Check if the game already exists in the user's wishlist. If it doesn't then we add it to the array, otherwise we throw an error
        const gameInWishlist = req.user.wishlist.find((item) => item.toString() === gameId);
        if (gameInWishlist) {
            return next(new ErrorResponse("Game already exists in the wishlist", 403));
        }
        req.user.wishlist.push(game._id);

        // Save the changes onto the database
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
            message: "Game added to wishlist",
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/wishlist/remove
// Desc: Removes a game from the user's wishlist if it already present in the wishlist.
async function removeFromWishlist(req, res, next) {
    const { gameId } = req.body;
    try {
        // Find the game by id and check if they exist in the database
        const game = await gameModel.findById(gameId);
        if (!game) {
            return next(new ErrorResponse(`Game with ID ${gameId} was not found.`, 404));
        }

        // Check if the game already exists in the user's wishlist. If it does then we filter it out of the array, otherwise we throw an error
        const gameInWishlist = req.user.wishlist.find((item) => item.toString() === gameId);
        if (!gameInWishlist) {
            return next(new ErrorResponse("Game does not exist in the wishlist", 403));
        }
        req.user.wishlist = req.user.wishlist.filter((item) => item.toString() !== gameId);

        // Save the changes onto the database
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
            message: "Game removed from wishlist",
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/cart/add
// Desc: Adds a game to the user's cart if it isn't present in the cart.
async function addToCart(req, res, next) {
    const { gameId } = req.body;
    try {
        // Find the game by id and check if they exist in the database
        const game = await gameModel.findById(gameId);
        if (!game) {
            return next(new ErrorResponse(`Game with ID ${gameId} was not found.`, 404));
        }

        // Check if the game already exists in the user's cart. If it doesn't then we add it to the array, otherwise we throw an error
        const gameInCart = req.user.cart.find((item) => item.toString() === gameId);
        if (gameInCart) {
            return next(new ErrorResponse("Game already exists in the cart", 403));
        }
        req.user.cart.push(game._id);

        // Save the changes onto the database
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
            message: "Game added to cart",
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/cart/remove
// Desc: Removes a game from the user's cart if it already present in the cart.
async function RemoveFromCart(req, res, next) {
    const { gameId } = req.body;
    try {
        // Find the game by id and check if they exist in the database
        const game = await gameModel.findById(gameId);
        if (!game) {
            return next(new ErrorResponse(`Game with ID ${gameId} was not found.`, 404));
        }

        // Check if the game already exists in the user's cart. If it does then we filter it out of the array, otherwise we throw an error
        const gameInCart = req.user.cart.find((item) => item.toString() === gameId);
        if (!gameInCart) {
            return next(new ErrorResponse("Game does not exist in the cart", 403));
        }
        req.user.cart = req.user.cart.filter((item) => item.toString() !== gameId);

        // Save the changes onto the database
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
            message: "Game removed from cart",
        });
    } catch (error) {
        next(error);
    }
}

// Method: GET
// URL: /api/users/me
// Desc: Retrives information about the user.
async function getUserProfile(req, res, next) {
    try {
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/me
// Desc: Updates information about the user.
async function updateUserProfile(req, res, next) {
    // Check whether the field being updated is one of username, email or password. If not, we throw an error.
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return next(new ErrorResponse("Invalid updates", 400));
    }
    try {
        if (updates.includes("email")) {
            const email = req.body.email;
            const user = await userModel.findOne({ email });
            if (user) return next(new ErrorResponse(`User with email ${email} already exists`, 400));
        }
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: req.user,
            message: `${updates.join(" and ")} updated successfully`,
        });
    } catch (error) {
        next(error);
    }
}

// Method: PATCH
// URL: /api/users/me/password
// Desc: Updates the user's password.
async function updateUserPassword(req, res, next) {
    try {
        const passwordsMatch = await req.user.isMatch(req.body.password.currentPassword);
        console.log(passwordsMatch);
        if (!passwordsMatch) {
            return next(new ErrorResponse("Incorrect current password", 401));
        }
        if (req.body.password.newPassword !== req.body.password.confirmPassword) {
            return next(new ErrorResponse("Passwords do not match", 409));
        }
        req.user.password = req.body.password.newPassword;
        await req.user.save();
        res.json({
            success: true,
            statusCode: 200,
            response: "Password updated successfully",
        });
    } catch (error) {
        next(error);
    }
}

// Method: DELETE
// URL: /api/users/me
// Desc: Deletes the user's account.
async function deleteUserProfile(req, res, next) {
    try {
        await req.user.remove();
        res.json({
            success: true,
            statusCode: 200,
            response: "Deleted successfully",
            message: "Account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    addToWishlist,
    removeFromWishlist,
    addToCart,
    RemoveFromCart,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserProfile,
};
