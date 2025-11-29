/**
 *  SmartAir City – IoT Platform for Urban Air Quality Monitoring
 *  based on NGSI-LD and FiWARE Standards
 *
 *  SPDX-License-Identifier: MIT
 *  @version   0.1.x
 *  @author    SmartAir City Team <smartaircity@gmail.com>
 *  @copyright © 2025 SmartAir City Team. 
 *  @license   MIT License
 *  See LICENSE file in root directory for full license text.
 *  @see       https://github.com/lequang2009k4/SmartAir-City   SmartAir City Open Source Project
 *
 *  This software is an open-source component of the SmartAir City initiative.
 *  It provides real-time environmental monitoring, NGSI-LD–compliant data
 *  models, MQTT-based data ingestion, and FiWARE Smart Data Models for
 *  open-data services and smart-city applications.
 */



using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace SmartAirCity.Models;

public class NumericProperty
{
    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "Property";

    [BsonElement("value")]
    [JsonPropertyName("value")]
    public double? Value { get; set; }

    [BsonElement("unitCode")]
    [JsonPropertyName("unitCode")]
    public string? UnitCode { get; set; }

    [BsonElement("observedAt")]
    [JsonPropertyName("observedAt")]
    public DateTime? ObservedAt { get; set; }
}

public class GeoValue
{
    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "Point";

    [BsonElement("coordinates")]
    [JsonPropertyName("coordinates")]
    public double[] Coordinates { get; set; } = new double[2];
}

public class LocationProperty
{
    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "GeoProperty";

    [BsonElement("value")]
    [JsonPropertyName("value")]
    public GeoValue Value { get; set; } = new();
}

[BsonIgnoreExtraElements]
public class DateTimeProperty
{
    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "Property";

    [BsonElement("value")]
    [JsonPropertyName("value")]
    public DateTime Value { get; set; }
}

public class Relationship
{
    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "Relationship";

    [BsonElement("object")]
    [JsonPropertyName("object")]
    public string Object { get; set; } = string.Empty;
}

[BsonIgnoreExtraElements]
public class AirQuality
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonIgnore] // Khong hien thi MongoId ra JSON NGSI-LD
    public string? MongoId { get; set; }

    [BsonElement("id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("type")]
    [JsonPropertyName("type")]
    public string Type { get; set; } = "AirQualityObserved";

    [BsonElement("@context")]
    [JsonPropertyName("@context")]
    public object[] Context { get; set; } =
    {
        "https://smartdatamodels.org/context.jsonld",
        new { sosa = "http://www.w3.org/ns/sosa/" }
    };

    [BsonElement("sosa:madeBySensor")]
    [JsonPropertyName("sosa:madeBySensor")]
    public Relationship? MadeBySensor { get; set; }

    [BsonElement("sosa:observedProperty")]
    [JsonPropertyName("sosa:observedProperty")]
    public Relationship? ObservedProperty { get; set; }

    [BsonElement("sosa:hasFeatureOfInterest")]
    [JsonPropertyName("sosa:hasFeatureOfInterest")]
    public Relationship? HasFeatureOfInterest { get; set; }

    [BsonElement("location")]
    [JsonPropertyName("location")]
    public LocationProperty Location { get; set; } = new();

    [BsonElement("dateObserved")]
    [JsonPropertyName("dateObserved")]
    public DateTimeProperty DateObserved { get; set; } = new()
    {
        Value = DateTime.UtcNow
    };

    [BsonElement("PM25")]
    [JsonPropertyName("PM25")]
    public NumericProperty? Pm25 { get; set; }

    [BsonElement("PM10")]
    [JsonPropertyName("PM10")]
    public NumericProperty? Pm10 { get; set; }

    [BsonElement("O3")]
    [JsonPropertyName("O3")]
    public NumericProperty? O3 { get; set; }

    [BsonElement("NO2")]
    [JsonPropertyName("NO2")]
    public NumericProperty? No2 { get; set; }

    [BsonElement("SO2")]
    [JsonPropertyName("SO2")]
    public NumericProperty? So2 { get; set; }

    [BsonElement("CO")]
    [JsonPropertyName("CO")]
    public NumericProperty? Co { get; set; }

    [BsonElement("airQualityIndex")]
    [JsonPropertyName("airQualityIndex")]
    public NumericProperty? AirQualityIndex { get; set; }
}
