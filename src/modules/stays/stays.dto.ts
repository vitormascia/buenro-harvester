import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
	IsBoolean, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString,
	Max, MaxLength, Min, MinLength,
} from "class-validator";

import { StayPriceSegment } from "./@types/stays.enums.js";

const allowedSortByColumns = [
	"city",
	"pricePerNight",
	"name",
	"country",
	"priceSegment",
];

export class QueryStaysDto {
	/* --- Full Text Search --- */
	@ApiProperty({
		type: String,
		required: false,
		description: "Stay name, city or country",
	})
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly text?: string;

	/* --- Exact Filtering (Common & Discriminator Fields) --- */
	@ApiProperty({
		type: String,
		required: false,
		description: "Stay name",
	})
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly name?: string;

	@ApiProperty({
		type: String,
		required: false,
		description: "Stay city",
	})
	@MaxLength(150)
	@MinLength(1)
	@IsOptional()
	@IsString()
	public readonly city?: string;

	@ApiProperty({
		type: String,
		required: false,
		description: "Stay country",
	})
	@MaxLength(150)
	@MinLength(1)
	@IsString()
	@IsOptional()
	public readonly country?: string;

	@ApiProperty({
		enum: StayPriceSegment,
		required: false,
		description: "Stay price segment",
	})
	@IsEnum(StayPriceSegment)
	@IsOptional()
	public readonly priceSegment?: StayPriceSegment;

	@ApiProperty({
		type: Boolean,
		required: false,
		description: "True for available, otherwise false",
	})
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }: { value: any }): any => {
		if (value === "true" || value === "1") {
			return true;
		}

		if (value === "false" || value === "0") {
			return false;
		}

		return value;
	})
	public readonly isAvailable?: boolean;

	/* --- Numeric Range Filtering (PricePerNight) --- */
	@ApiProperty({
		type: Number,
		required: false,
		description: "Stay minimum price",
	})
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly minPrice?: number;

	@ApiProperty({
		type: Number,
		required: false,
		description: "Stay maximum price",
	})
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly maxPrice?: number;

	/* --- Pagination and Sorting --- */
	@ApiProperty({
		type: Number,
		required: false,
		default: 0,
		description: "Stays records to skip",
	})
	@Min(0)
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly skip: number = 0;

	@ApiProperty({
		type: Number,
		required: false,
		default: 25,
		description: "Stays records limit",
	})
	@Max(100)
	@IsPositive()
	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	public readonly limit: number = 25;

	@ApiProperty({
		type: String,
		required: false,
		default: "pricePerNight",
		description: "Stays sort by key",
	})
	@IsIn(allowedSortByColumns)
	@IsOptional()
	public readonly sortBy?: string = "pricePerNight";

	@ApiProperty({
		type: String,
		required: false,
		default: "ASC",
		description: "Stays sorting direction",
	})
	@IsIn(["ASC", "DESC"])
	@IsOptional()
	public readonly sortDirection?: "ASC" | "DESC" = "ASC";
}
