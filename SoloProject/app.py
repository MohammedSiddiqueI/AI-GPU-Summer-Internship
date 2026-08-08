import os
import uuid

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for
)

from werkzeug.utils import secure_filename

from face_utils import (
    register_face,
    recognize_face,
    load_persons
)


app = Flask(__name__)


UPLOAD_FOLDER = "uploads"
DATA_FOLDER = "data"

RESULT_FOLDER = os.path.join(
    "static",
    "results"
)

FACES_FOLDER = os.path.join(
    DATA_FOLDER,
    "faces"
)


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    DATA_FOLDER,
    exist_ok=True
)

os.makedirs(
    RESULT_FOLDER,
    exist_ok=True
)

os.makedirs(
    FACES_FOLDER,
    exist_ok=True
)


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg"
}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(
            ".",
            1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )


@app.route("/")
def home():
    return redirect(
        url_for("register")
    )


@app.route(
    "/register",
    methods=["GET", "POST"]
)
def register():
    message = None
    success = False

    if request.method == "POST":
        name = request.form.get(
            "name",
            ""
        ).strip()

        image = request.files.get(
            "image"
        )

        if not name:
            message = (
                "Please enter the person's name."
            )

        elif (
            not image
            or image.filename == ""
        ):
            message = (
                "Please select an image."
            )

        elif not allowed_file(
            image.filename
        ):
            message = (
                "Only JPG, JPEG and PNG "
                "images are allowed."
            )

        else:
            extension = (
                image.filename
                .rsplit(".", 1)[1]
                .lower()
            )

            filename = (
                f"{uuid.uuid4().hex}."
                f"{extension}"
            )

            temp_path = os.path.join(
                UPLOAD_FOLDER,
                filename
            )

            image.save(
                temp_path
            )

            try:
                result = register_face(
                    image_path=temp_path,
                    name=name,
                    data_folder=DATA_FOLDER
                )

                success = result["success"]

                message = result[
                    "message"
                ]

            except Exception as e:
                message = (
                    f"Registration failed: {str(e)}"
                )

            finally:
                if os.path.exists(
                    temp_path
                ):
                    os.remove(
                        temp_path
                    )

    persons = load_persons(
        DATA_FOLDER
    )

    return render_template(
        "register.html",
        message=message,
        success=success,
        persons=persons
    )


@app.route(
    "/recognize",
    methods=["GET", "POST"]
)
def recognize():
    message = None
    result_image = None
    matches = []

    persons = load_persons(
        DATA_FOLDER
    )

    if request.method == "POST":
        image = request.files.get(
            "image"
        )

        if not persons:
            message = (
                "Register at least one "
                "person first."
            )

        elif (
            not image
            or image.filename == ""
        ):
            message = (
                "Please select an image."
            )

        elif not allowed_file(
            image.filename
        ):
            message = (
                "Only JPG, JPEG and PNG "
                "images are allowed."
            )

        else:
            original_name = secure_filename(
                image.filename
            )

            extension = (
                original_name
                .rsplit(".", 1)[1]
                .lower()
            )

            unique_id = uuid.uuid4().hex

            upload_filename = (
                f"{unique_id}.{extension}"
            )

            upload_path = os.path.join(
                UPLOAD_FOLDER,
                upload_filename
            )

            result_filename = (
                f"{unique_id}_result.jpg"
            )

            result_path = os.path.join(
                RESULT_FOLDER,
                result_filename
            )

            image.save(
                upload_path
            )

            try:
                result = recognize_face(
                    image_path=upload_path,
                    data_folder=DATA_FOLDER,
                    output_path=result_path
                )

                if result["success"]:
                    matches = result[
                        "matches"
                    ]

                    result_image = (
                        f"results/"
                        f"{result_filename}"
                    )

                    faces_detected = result.get(
                        "faces_detected",
                        0
                    )

                    if matches:
                        message = (
                            f"{len(matches)} "
                            f"registered match(es) found."
                        )

                    elif faces_detected > 0:
                        message = (
                            "Faces detected, but no "
                            "registered person matched."
                        )

                    else:
                        message = (
                            "No faces were detected."
                        )

                else:
                    message = result[
                        "message"
                    ]

            except Exception as e:
                message = (
                    f"Recognition failed: {str(e)}"
                )

            finally:
                if os.path.exists(
                    upload_path
                ):
                    os.remove(
                        upload_path
                    )

    return render_template(
        "recognize.html",
        message=message,
        result_image=result_image,
        matches=matches,
        persons=persons
    )


if __name__ == "__main__":
    app.run(
        debug=True
    )