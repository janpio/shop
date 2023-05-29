import Image from "next/image";
import Card from "src/components/Card";
import Icon from "src/components/Icon";
import { cx } from "class-variance-authority";
import CommentTextarea from "src/components/CommentTextarea";
import { trpc } from "src/utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import appRouter from "src/server/routes/_app";
import { createContext } from "src/server/context";

export const getServerSideProps = async (req: any) => {
	const { id } = req.query;

	const ssr = createServerSideHelpers({
		router: appRouter,
		ctx: await createContext(req),
	});

	await ssr.product.getAll.prefetch();
	await ssr.product.getById.prefetch(id);

	return {
		props: {
			id,
			trpcState: JSON.parse(JSON.stringify(ssr.dehydrate())),
		},
	};
};

const Product = ({ id }: any) => {
	const { data: product }: any = trpc.product.getById.useQuery(id);
	const { data: products }: any = trpc.product.getAll.useQuery();
	return (
		<>
			<div className="container">
				<div className="flex flex-col justify-between mb-2 gap-x-4 lg:items-end lg:flex-row">
					<div>
						<h1 className="text-5xl font-bold">{product.name}</h1>
					</div>
					<div className="mt-2 rating">
						<div className="flex items-center">
							<div className="flex items-center gap-1">
								<Icon className="w-4 h-4 fill-current" name="star" />
								<p className="flex text-sm opacity-60 whitespace-nowrap">
									{(product._avg.rate || 0).toFixed(1)} / 5
								</p>
							</div>
							<div className="mx-0 divider divider-horizontal"></div>
							<div className="flex items-center gap-1">
								<Icon className="w-4 h-4 fill-current" name="comment" />
								<p className="flex text-sm opacity-60 whitespace-nowrap">
									{product.commented.length} comments
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="sticky z-10 bg-base-300 top-16">
				<div className="container py-2 pb-0 my-4 mb-4">
					<div className="overflow-auto tabs flex-nowrap">
						<a className="tab tab-bordered tab-active">All</a>
						<a className="tab tab-bordered">Сharacteristics</a>
						<a className="tab tab-bordered">Reviews</a>
						<a className="tab tab-bordered">Questions</a>
						<a className="tab tab-bordered">Video</a>
						<a className="tab tab-bordered">Images</a>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="flex flex-col gap-12 md:flex-row">
					<div className="flex-1">
						<div className="sticky w-full top-28">
							<div className="rounded-lg">
								<Image
									width="600"
									height="700"
									className="object-cover h-[560px] w-full rounded-[inherit]"
									src={product.poster}
									alt={""}
								/>
							</div>
							{/* <div className="gap-4 mt-4 carousel carousel-center">
								{product.carousel.map((imgSrc, i) => {
									return (
										<div key={i} className="rounded-lg carousel-item">
											<Image
												width="600"
												height="700"
												className="object-cover h-[180px] w-full rounded-[inherit]"
												src={imgSrc}
												alt={""}
											/>
										</div>
									);
								})}
							</div> */}
						</div>
					</div>
					<div className="flex-1">
						<div>
							<span
								className={cx(
									"badge",
									product.isInStock ? "badge-success" : " badge-error"
								)}
							>
								{product.isInStock ? "in stock" : "not in stock"}
							</span>
							{product.tags_name.map((tag: any) => {
								return (
									<span key={tag.id} className="cursor-pointer badge">
										{tag.name}
									</span>
								);
							})}
						</div>
						<div className="mt-2">
							<p>{product.description}</p>
						</div>
						<div className="flex items-center justify-between my-4">
							<div>
								<p className="text-4xl font-bold">${product.price}</p>
							</div>
							<div className="flex gap-2">
								<button className="btn btn-sm btn-primary">
									<Icon className="w-6 h-6 p-0.5 fill-current" name="cart" />
								</button>
								<button className="btn btn-sm btn-primary">
									<Icon
										className="w-6 h-6 p-0.5 fill-current"
										name="compare-horizontal"
									/>
								</button>
								<button className="btn btn-sm btn-primary">
									<Icon className="w-6 h-6 p-0.5 fill-current" name="heart" />
								</button>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							{Array(1)
								.fill(0)
								.map((_, i) => {
									return (
										<div
											key={i}
											className="flex flex-col gap-4 p-4 border shadow-lg border-base-200 rounded-box"
										>
											{Array(2)
												.fill(0)
												.map((_, j) => {
													return (
														<div className="flex gap-2" key={j}>
															<Icon
																className="w-8 h-8 fill-current"
																name="cart"
															/>
															<div className="flex-1">
																<h4 className="text-lg font-bold">
																	asdfadf asdf as f
																</h4>
																<p>
																	Lorem ipsum dolor, sit amet consectetur
																	adipisicing elit. Velit alias quam vitae!
																	Atque dicta dolor assumenda facere inventore
																	tenetur voluptatibus at temporibus ducimus,
																	autem id porro voluptatum quam nesciunt
																	reiciendis.
																</p>
															</div>
														</div>
													);
												})}
										</div>
									);
								})}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-8 mt-8 md:flex-row">
					<div className="flex-1">
						<div>
							<h3 className="text-4xl font-bold">Characteristics</h3>
						</div>
						<div className="relative grid flex-1 grid-cols-1 gap-8 p-4 mt-4 border shadow-lg sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 bg-base-100 rounded-xl border-base-200">
							{Array(10)
								.fill(0)
								.map((_, i) => {
									return (
										<div key={i} className="flex gap-4">
											<div>
												<p
													className="flex items-center text-left cursor-pointer tooltip"
													data-tip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum"
												>
													<span className="font-bold">Brand:</span>
													<Icon
														className="w-4 h-4 fill-current opacity-60"
														name="help-circle"
													/>
												</p>
											</div>
											<div className="flex-1 text-right">
												<p>Lorem</p>
											</div>
										</div>
									);
								})}
						</div>
					</div>
					<div className="flex flex-1">
						<div className="flex-1">
							<div className="flex items-center">
								<div className="flex-1">
									<h3 className="text-4xl font-bold">Reviews</h3>
								</div>
								{/* <div>
									<div className="dropdown dropdown-end">
										<label tabIndex={0} className="btn btn-sm btn-outline">
											category
											<Icon
												className="w-6 h-6 fill-current opacity-60"
												name="chevron-down"
											/>
										</label>
										<ul
											tabIndex={0}
											className="min-w-full p-2 shadow-lg dropdown-content menu menu-compact bg-base-100 rounded-box"
										>
											{[{ label: "Date" }, { label: "Popularity" }].map(
												({ label }) => {
													return (
														<li key={label} tabIndex={0}>
															<label>{label}</label>
														</li>
													);
												}
											)}
										</ul>
									</div>
								</div> */}
							</div>
							<div className="w-full mt-2 shadow-lg stats">
								<div className="flex flex-1">
									<div className="flex flex-1 gap-4 stat">
										<div>
											<div className="stat-title">Average rating</div>
											<div className="text-5xl stat-value">
												{(product._avg.rate || 0).toFixed(1)}
											</div>
											<div className="items-center rating">
												{Array(5)
													.fill(0x00)
													.map((_, i) => {
														return (
															<input
																type="radio"
																name="average-rating"
																className="mask mask-star"
																readOnly
																checked={product._avg.rate > i}
																key={"average" + i}
															/>
														);
													})}
											</div>
											<div className="flex items-center">
												<div className="flex items-center gap-1">
													<Icon
														className="w-4 h-4 fill-current"
														name="comment"
													/>
													<p className="flex text-sm opacity-60 whitespace-nowrap">
														{product._count._all} comments
													</p>
												</div>
											</div>
										</div>
										<div className="flex-1 stat-desc">
											<div className="flex flex-col gap-1">
												{Array(6)
													.fill(0x00)
													.map((_, i) => {
														return (
															<div
																className="flex items-center gap-1"
																key={5 - i}
															>
																<p>{5 - i}</p>
																<progress
																	className="flex-1 w-full progress progress-primary"
																	value={product.balling.reduce(
																		(a: number, b: { rate: number }) =>
																			b.rate === 5 - i ? a + 1 : a,
																		0
																	)}
																	max={Math.max(
																		...product.balling.map(
																			(x: { rate: number }) => x.rate
																		)
																	)}
																></progress>
															</div>
														);
													})}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="relative flex flex-col gap-4 p-4 mt-4 border shadow-lg bg-base-100 rounded-xl border-base-200">
								<CommentTextarea productId={product.id} />
								{product.commented.length === 0 && (
									<div className="text-2xl font-bold text-center">
										No comment yet
									</div>
								)}
								{product.commented.map((comment: any) => {
									return (
										<div key={comment.id} className="flex items-start gap-2">
											<Image
												className="object-cover mask mask-circle"
												width="48"
												height="48"
												src={comment.User.avatar}
												alt="avatar"
											/>
											<div className="flex flex-col justify-center flex-1">
												<div className="flex items-center gap-2">
													<div>
														<div className="flex items-baseline gap-2">
															<h4 className="text-lg font-bold">
																{comment.User.username}
															</h4>
															<span className="text-sm opacity-60 whitespace-nowrap">
																{new Date(comment.createdAt).toDateString()}
															</span>
														</div>
														<div className="items-center rating rating-sm">
															{Array(5)
																.fill(0x00)
																.map((_, i: number) => {
																	return (
																		<input
																			type="radio"
																			name={comment.id}
																			className="mask mask-star"
																			readOnly
																			key={comment.id + i}
																			checked={comment.rate === i + 1}
																		/>
																	);
																})}
														</div>
													</div>
													{/* <div className="flex justify-end flex-1">
														<div>
															<Icon
																className="w-8 h-8 fill-current"
																name="reply"
															/>
														</div>
													</div> */}
												</div>
												<div className="flex gap-2">
													<p className="line-clamp-4">{comment.content}</p>
												</div>
												<div className="mt-2">
													<div className="btn btn-sm group">
														<Icon
															className="w-8 h-8 p-1.5 fill-current"
															name="thumb-up"
														/>
														{comment.likes}
													</div>
												</div>
											</div>
										</div>
									);
								})}

								{product.commented.length > 3 && (
									<div className="absolute bottom-0 left-0 right-0 rounded-[inherit]">
										<div className="flex justify-center rounded-[inherit] pt-16 pb-4 bg-gradient-to-b from-transparent via-base-200 to-base-300">
											<button className="btn btn-primary">Read more</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<h3 className="text-4xl font-bold">Popular products</h3>
					<div className="grid gap-4 mt-4 grid-cols-item">
						{products.map((product: any) => {
							return <Card product={product} key={product.id} />;
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default Product;
