CREATE FUNCTION incrementSerialNumberContentTopic() RETURNS trigger AS $incrementSerialNumberContentTopic$
    DECLARE
        topic_serial_number SMALLINT;
    BEGIN
        SELECT MAX("serialNumber") INTO topic_serial_number
        FROM course_content_topic
        WHERE "idCourse_id"= NEW."idCourse_id";
        IF topic_serial_number IS NULL THEN
            topic_serial_number := 0;
        END IF;
        NEW."serialNumber" := topic_serial_number + 1;
        RETURN NEW;
    END;
$incrementSerialNumberContentTopic$ LANGUAGE plpgsql;

CREATE TRIGGER incrementSerialNumberContentTopic BEFORE INSERT on course_content_topic
    FOR EACH ROW EXECUTE PROCEDURE incrementSerialNumberContentTopic();

CREATE FUNCTION incrementSerialNumberTopicNavigate() RETURNS trigger AS $incrementSerialNumberTopicNavigate$
    DECLARE
        topic_serial_number SMALLINT;
    BEGIN
        SELECT MAX("serialNumber") INTO topic_serial_number
        FROM course_content_topicnavigate
        WHERE "idTopic_id" = NEW."idTopic_id";

        IF topic_serial_number IS NULL THEN
            topic_serial_number := 0;
        END IF;

        NEW."serialNumber" := topic_serial_number + 1;
        RETURN NEW;
    END;
$incrementSerialNumberTopicNavigate$ LANGUAGE plpgsql;

CREATE TRIGGER incrementSerialNumberTopicNavigate BEFORE INSERT ON course_content_topicnavigate
    FOR EACH ROW EXECUTE PROCEDURE incrementSerialNumberTopicNavigate();